import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const FILE_BUCKET = "product-files";
const SIGNED_URL_EXPIRY_SECONDS = 300; // 5 minutes

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const code = String(body?.code || "").trim().toUpperCase();
    const slug = String(body?.slug || "").trim();

    if (!code || !slug) {
      return NextResponse.json({ error: "Missing code or product." }, { status: 400 });
    }

    // 1. Look up the product (server-side only).
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, is_license, download_url, storage_path")
      .eq("slug", slug)
      .eq("is_active", true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // 2. Look up the code.
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

    // 3. Atomically mark the code as used.
    const { data: updated, error: updateError } = await supabaseAdmin
      .from("codes")
      .update({ status: "used", used_at: new Date().toISOString() })
      .eq("id", codeRecord.id)
      .eq("status", "unused")
      .select()
      .single();

    if (updateError || !updated) {
      return NextResponse.json({ error: "Could not verify code - it may have just been used." }, { status: 400 });
    }

    // 4. Track installs/downloads.
    const { error: countError } = await supabaseAdmin.rpc("increment_download_count", { pid: product.id });
    if (countError) console.warn("count error:", countError["message"]);

    // 5. License key product: claim one unused key from the pool.
    if (product.is_license) {
      const { data: licenseKey, error: licError } = await supabaseAdmin.rpc("claim_license_key", { pid: product.id });
      if (licError || !licenseKey) {
        return NextResponse.json({ error: "License keys are currently out of stock. Please contact support." }, { status: 500 });
      }
      return NextResponse.json({ licenseKey });
    }

    // 6. Regular product: resolve download links.
    const { data: files } = await supabaseAdmin
      .from("product_files")
      .select("file_name, storage_path")
      .eq("product_id", product.id)
      .order("created_at", { ascending: true });

    if (files && files.length > 0) {
      const downloadUrls: { fileName: string; url: string }[] = [];
      for (const file of files) {
        const { data: signed, error: signError } = await supabaseAdmin.storage
          .from(FILE_BUCKET)
          .createSignedUrl(file.storage_path, SIGNED_URL_EXPIRY_SECONDS, { download: file.file_name });
        if (signError || !signed) {
          return NextResponse.json({ error: "Could not generate download link." }, { status: 500 });
        }
        downloadUrls.push({ fileName: file.file_name, url: signed.signedUrl });
      }
      return NextResponse.json({ downloadUrls });
    }

    if (product.storage_path) {
      const { data: signed, error: signError } = await supabaseAdmin.storage
        .from(FILE_BUCKET)
        .createSignedUrl(product.storage_path, SIGNED_URL_EXPIRY_SECONDS, { download: "download" });
      if (signError || !signed) {
        return NextResponse.json({ error: "Could not generate download link." }, { status: 500 });
      }
      return NextResponse.json({ downloadUrls: [{ fileName: "download", url: signed.signedUrl }] });
    }

    if (product.download_url) {
      return NextResponse.json({ downloadUrls: [{ fileName: "download", url: product.download_url }] });
    }

    return NextResponse.json({ error: "This product has no file configured." }, { status: 500 });
  } catch (err: any) {
    console.error("redeem route error:", err);
    return NextResponse.json({ error: "Something went wrong. Try again." }, { status: 500 });
  }
}
