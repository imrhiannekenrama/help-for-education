import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const FILE_BUCKET = "product-files";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = String(body?.code || "").trim().toUpperCase();
    const slug = String(body?.slug || "").trim();

    if (!code || !slug) {
      return NextResponse.json({ error: "Missing code or product." }, { status: 400 });
    }

    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const { data: codeRecord, error: codeError } = await supabaseAdmin
      .from("codes")
      .select("id, status, product_id")
      .eq("code", code)
      .single();

    if (codeError || !codeRecord) {
      return NextResponse.json({ error: "Invalid code." }, { status: 400 });
    }
    if (codeRecord.status !== "unused") {
      return NextResponse.json({ error: "This code has already been used." }, { status: 400 });
    }
    if (codeRecord.product_id !== product.id) {
      return NextResponse.json({ error: "This code is not valid for this product." }, { status: 400 });
    }

    const { data: updated, error: updateError } = await supabaseAdmin
      .from("codes")
      .update({ status: "used", used_at: new Date().toISOString() })
      .eq("id", codeRecord.id)
      .eq("status", "unused")
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: "Could not verify code." }, { status: 400 });
    }

    // Get all files for this product
    const { data: files } = await supabaseAdmin
      .from("product_files")
      .select("id, file_name, storage_path, file_size")
      .eq("product_id", product.id)
      .order("created_at", { ascending: true });

    const downloadUrls: { fileName: string; url: string }[] = [];

    if (files && files.length > 0) {
      for (const file of files) {
        const { data: signed, error: signError } = await supabaseAdmin.storage
  .from(FILE_BUCKET)
  .createSignedUrl(file.storage_path, 300, {
    download: file.file_name,
  });


        if (!signError && signed) {
          downloadUrls.push({ fileName: file.file_name, url: signed.signedUrl });
        }
      }
    }

    // Fallback: check for old single-file storage_path or download_url on product
    if (downloadUrls.length === 0) {
      const { data: prod } = await supabaseAdmin
        .from("products")
        .select("download_url, storage_path")
        .eq("id", product.id)
        .single();

      if (prod?.storage_path) {
        const { data: signed, error: signError } = await supabaseAdmin.storage
  .from(FILE_BUCKET)
  .createSignedUrl(prod.storage_path, 300, {
    download: "download",
  });


        if (!signError && signed) {
          downloadUrls.push({ fileName: "download", url: signed.signedUrl });
        }
      } else if (prod?.download_url) {
        downloadUrls.push({ fileName: "download", url: prod.download_url });
      }
    }

    if (downloadUrls.length === 0) {
      return NextResponse.json({ error: "No files configured for this product." }, { status: 500 });
    }

    return NextResponse.json({ downloadUrls });
  } catch (err: any) {
    console.error("redeem route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
