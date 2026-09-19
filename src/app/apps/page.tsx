"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Download, MonitorSmartphone } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";

interface App {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
}

export default function AppsPage() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchApps() {
      const { data } = await supabase
        .from("products")
        .select("id, name, slug, description, price, image, download_count")
        .eq("is_active", true)
        .eq("category", "app")
        .order("created_at", { ascending: false });
      setApps(data || []);
      setLoading(false);
    }
    fetchApps();
  }, []);

  return (
    <>
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
              <MonitorSmartphone className="h-4 w-4" /> Software & Apps
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">App Store</h1>
            <p className="mx-auto mt-4 max-w-xl text-gray-500">
              Get instant access to our software. Enter your download code after payment to install.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 flex justify-center"><Spinner /></div>
          ) : apps.length === 0 ? (
            <div className="mt-12 text-center text-gray-400">
              <Package className="mx-auto h-12 w-12" />
              <p className="mt-4">No apps available yet. Check back soon!</p>
            </div>
          ) : (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {apps.map((app, i) => (
                <motion.div key={app.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
                  <div className="flex items-start gap-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500 to-emerald-500">
                      {app.image ? (
                        <img src={app.image} alt={app.name} className="h-full w-full object-cover" />
                      ) : (
                        <MonitorSmartphone className="h-8 w-8 text-white" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">{app.name}</h3>
                      <Badge className="mt-1">₱{app.price}</Badge>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm text-gray-500 line-clamp-3">{app.description}</p>
                  <p className="mt-2 text-xs text-gray-400">{(app.download_count || 0).toLocaleString()} installs</p>
                  <Link href={`/product/${app.slug}`} className="mt-5">
                    <Button className="w-full"><Download className="mr-2 h-4 w-4" /> Install</Button>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-14 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center dark:border-gray-800 dark:bg-gray-900/50">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">How to install</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              Message us on Messenger to purchase, receive your download code, click Install, enter the code, and download instantly.
            </p>
            <Link href="/#how-it-works" className="mt-4 inline-block text-sm font-medium text-blue-600 dark:text-blue-400">See how it works</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

