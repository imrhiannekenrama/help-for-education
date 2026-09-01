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
      .select("id, download_url, storage_path")
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

    let downloadUrl: string | null = null;

    if (product.storage_path) {
      const { data: signed, error: signError } = await supabaseAdmin.storage
        .from(FILE_BUCKET)
        .createSignedUrl(product.storage_path, 300);

      if (signError || !signed) {
        return NextResponse.json({ error: "Could not generate download link." }, { status: 500 });
      }
      downloadUrl = signed.signedUrl;
    } else if (product.download_url) {
      downloadUrl = product.download_url;
    } else {
      return NextResponse.json({ error: "No file configured." }, { status: 500 });
    }

    return NextResponse.json({ downloadUrl });
  } catch (err: any) {
    console.error("redeem route error:", err);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
