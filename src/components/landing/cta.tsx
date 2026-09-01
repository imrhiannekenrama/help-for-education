"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FACEBOOK_PAGE } from "@/lib/constants";

export function CTA() {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-4 lg:px-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 to-emerald-500 p-12 text-center shadow-xl">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to get your resources?</h2>
          <p className="mx-auto mt-4 max-w-xl text-blue-50">Browse our products and message us on MessageCircle to order. Get your download code and access instantly.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/#products"><Button size="lg" variant="outline" className="bg-white hover:bg-gray-50 text-blue-600 border-white">Browse Products <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800 text-white border border-blue-700"><MessageCircle className="mr-2 h-4 w-4" /> Order on MessageCircle</Button>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
