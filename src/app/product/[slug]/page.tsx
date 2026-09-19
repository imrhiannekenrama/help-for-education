"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowLeft, Download, KeyRound, Check, ShieldCheck, FileArchive, MessageCircle, Copy } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import { FACEBOOK_PAGE } from "@/lib/constants";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description: string;
  price: number;
  image: string;
  features: string[];
  bonuses: string[];
  file_size: string;
  is_license: boolean;
  category: string;
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [downloadUrls, setDownloadUrls] = useState<{ fileName: string; url: string }[] | null>(null);
  const [licenseKey, setLicenseKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [renewMode, setRenewMode] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, description, long_description, price, image, features, bonuses, file_size, is_license, category")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  async function copyKey() {
    if (!licenseKey) return;
    try {
      await navigator.clipboard.writeText(licenseKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !product) return;

    setVerifying(true);
    setDownloadUrls(null);
    setLicenseKey(null);

    try {
      const res = await fetch("/api/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim(), slug: product.slug }),
      });
      const result = await res.json();

      if (!res.ok || (!result.downloadUrls && !result.licenseKey)) {
        toast({
          title: "Invalid Code",
          description: result.error || "This code is invalid or already used.",
          variant: "destructive",
        });
        setVerifying(false);
        return;
      }

      if (result.licenseKey) setLicenseKey(result.licenseKey);
      if (result.downloadUrls) setDownloadUrls(result.downloadUrls);

      toast({
        title: result.licenseKey && result.downloadUrls ? "Ready to Install!" : result.licenseKey ? "License Key Ready!" : "Code Verified!",
        description: "See your details below.",
      });
    } catch {
      toast({ title: "Error", description: "Something went wrong. Try again.", variant: "destructive" });
    }
    setVerifying(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] items-center justify-center"><Spinner /></div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4">
          <Package className="h-12 w-12 text-gray-400" />
          <p className="text-gray-500">Product not found.</p>
          <Link href="/"><Button variant="outline">Back to Home</Button></Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-6xl px-4 lg:px-8">
          <Link href="/#products" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Products
          </Link>

          <div className="grid gap-8 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="relative h-72 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center"><Package className="h-16 w-16 text-gray-400" /></div>
                  )}
                  <Badge className="absolute top-4 right-4 text-base">₱{product.price}</Badge>
                </div>
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</h1>
                  <p className="mt-2 text-sm text-gray-500">{product.description}</p>
                  {product.long_description && (
                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-300">{product.long_description}</p>
                  )}
                  {product.is_license && (
                    <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                      <KeyRound className="h-3.5 w-3.5" /> License key delivered instantly after redemption
                    </div>
                  )}
                  {product.file_size && !product.is_license && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                      <FileArchive className="h-4 w-4" /> File size: {product.file_size}
                    </div>
                  )}
                </div>
              </div>

              {product.features.length > 0 && (
                <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white">What is Included</h3>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Check className="h-4 w-4 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  {product.bonuses.length > 0 && (
                    <>
                      <h3 className="mt-6 font-semibold text-gray-900 dark:text-white">Bonus Materials</h3>
                      <ul className="mt-3 space-y-2">
                        {product.bonuses.map((b, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <Check className="h-4 w-4 text-emerald-500" /> {b}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                {!licenseKey && !downloadUrls ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white">
                        <KeyRound className="h-6 w-6" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{renewMode ? "Enter Code to Renew" : product.category === "app" ? "Enter Code to Install" : product.is_license ? "Enter Purchase Code" : "Enter Download Code"}</h2>
                        <p className="text-xs text-gray-500">{renewMode ? "Buy a new code, enter it here, and instantly get a fresh license key." : product.category === "app" ? "Enter the code you received after payment to install." : product.is_license ? "Enter the code you received after payment to get your license key." : "Enter the code you received after payment."}</p>
                      </div>
                    </div>

                    <form onSubmit={handleDownload} className="mt-6 space-y-4">
                      <div>
                        <Label htmlFor="code">{product.is_license ? "Purchase Code" : "Download Code"}</Label>
                        <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} className="mt-1.5 font-mono uppercase" placeholder="H4E-XXXX-XXXX-XXXX" required disabled={verifying} />
                      </div>
                      <Button type="submit" className="w-full" disabled={verifying || !code.trim()}>
                        {verifying ? <><Spinner className="mr-2" /> Verifying...</> : renewMode ? <><KeyRound className="mr-2 h-4 w-4" /> Renew Subscription</> : product.category === "app" ? <><Download className="mr-2 h-4 w-4" /> Install</> : product.is_license ? <><KeyRound className="mr-2 h-4 w-4" /> Get License Key</> : <><Download className="mr-2 h-4 w-4" /> Verify & Download</>}
                      </Button>
                    </form>

                    {product.is_license && (
                      <button type="button" onClick={() => setRenewMode(!renewMode)} className="mt-4 w-full text-center text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
                        {renewMode ? "Cancel Renewal" : "Subscription expired? Renew here"}
                      </button>
                    )}

                    <div className="mt-6 rounded-xl bg-blue-50 dark:bg-blue-950/30 p-4">
                      <p className="text-sm text-blue-700 dark:text-blue-300">
                        <ShieldCheck className="mr-1 inline h-4 w-4" />
                        Don&apos;t have a code yet?
                      </p>
                      <p className="mt-1 text-xs text-gray-500">Message us on Messenger to order and get your unique code.</p>
                      <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                        <MessageCircle className="h-4 w-4" /> Visit our Facebook Page
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="space-y-6">
                    {downloadUrls && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">Code Verified!</h2>
                        <p className="mt-2 text-sm text-gray-500">
                          {downloadUrls.length > 1 ? "Your downloads are ready. Click each file below." : "Your download is ready. Click below to get your file."}
                        </p>
                        <div className="mt-6 space-y-3">
                          {downloadUrls.map((file, i) => (
                            <a key={i} href={file.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-emerald-500 px-6 py-3 font-medium text-white hover:opacity-90 transition-opacity">
                              <Download className="h-5 w-5" />
                              {downloadUrls.length > 1 ? `Download ${file.fileName}` : product.category === "app" ? "Install Now" : "Download Now"}
                            </a>
                          ))}
                        </div>
                        <p className="mt-4 text-xs text-gray-400"><ShieldCheck className="inline h-3 w-3" /> Your code has been used and cannot be reused. Download links expire in 5 minutes.</p>
                      </motion.div>
                    )}

                    {licenseKey && (
                      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
                          <Check className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">License Key Ready!</h2>
                        <p className="mt-2 text-sm text-gray-500">Enter this key in Class House Manager to activate your subscription.</p>
                        <div className="mt-6 rounded-xl border-2 border-dashed border-emerald-300 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/30">
                          <code className="block break-all text-center font-mono text-lg font-bold text-emerald-700 dark:text-emerald-300">{licenseKey}</code>
                        </div>
                        <Button onClick={copyKey} className="mt-4 w-full"><Copy className="mr-2 h-4 w-4" /> {copied ? "Copied!" : "Copy License Key"}</Button>
                        <p className="mt-4 text-xs text-gray-400"><ShieldCheck className="inline h-3 w-3" /> Your purchase code has been used. Keep this license key safe.</p>
                        <p className="mt-2 text-xs text-blue-600 dark:text-blue-400">Subscription expired? Just buy a new code and enter it on this page to renew.</p>
                        <Button variant="outline" onClick={() => { setRenewMode(true); setLicenseKey(null); setDownloadUrls(null); }} className="mt-4 w-full"><KeyRound className="mr-2 h-4 w-4" /> Renew Subscription</Button>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}