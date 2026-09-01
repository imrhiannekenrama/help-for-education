"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowRight, Sparkles, Download, KeyRound, MessageCircle, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { FAQ } from "@/components/landing/faq";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { FAQS } from "@/lib/constants";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  features: string[];
}

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, description, price, image, features")
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      setProducts(data || []);
      setLoading(false);
    }
    fetchProducts();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
            <div className="absolute right-1/4 top-20 h-[400px] w-[400px] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
          </div>
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <div className="text-center">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
                  <Sparkles className="h-4 w-4" /> Premium Educational Resources
                </div>
                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
                  Premium Digital Products for{" "}
                  <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">Educators</span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                  Browse our collection of ready-to-use teaching resources. Pay via Messenger, get a download code, and access instantly.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="#products"><Button size="lg">Browse Products <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                  <Link href="#how-it-works"><Button size="lg" variant="outline">How It Works</Button></Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">How It Works</h2>
            <p className="mt-3 text-center text-gray-500">Three simple steps to get your resources.</p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {[
                { icon: MessageCircle, step: "1", title: "Message & Pay on Messenger", desc: "Browse our products, message us on Facebook, and pay via GCash." },
                { icon: KeyRound, step: "2", title: "Receive Your Code", desc: "After payment, we send you a unique download code for your product." },
                { icon: Download, step: "3", title: "Enter Code & Download", desc: "Enter the code on the product page and download instantly." },
              ].map((item) => (
                <motion.div key={item.step} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="rounded-2xl border border-gray-200 bg-white p-8 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 text-white"><item.icon className="h-6 w-6" /></div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section id="products" className="py-20 lg:py-28">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Our Products</h2>
            <p className="mt-3 text-center text-gray-500">Browse and click a product to get your download code.</p>

            {loading ? (
              <div className="mt-12 flex justify-center"><Spinner /></div>
            ) : products.length === 0 ? (
              <div className="mt-12 text-center text-gray-400">
                <Package className="mx-auto h-12 w-12" />
                <p className="mt-4">No products available yet. Check back soon!</p>
              </div>
            ) : (
              <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {products.map((product, i) => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <Link href={`/product/${product.slug}`} className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 transition-all hover:shadow-lg">
                      <div className="relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center"><Package className="h-12 w-12 text-gray-400" /></div>
                        )}
                        <Badge className="absolute top-3 right-3">₱{product.price}</Badge>
                      </div>
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">{product.description}</p>
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                          View Product <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        <section id="faq" className="py-20 bg-gray-50 dark:bg-gray-900/50">
          <div className="mx-auto max-w-3xl px-4 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Frequently Asked Questions</h2>
            <div className="mt-10 space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.question} className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{faq.question}</h3>
                  <p className="mt-2 text-sm text-gray-500">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
