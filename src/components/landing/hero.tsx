"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BookOpen, Download, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-32">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/4 top-0 h-[500px] w-[500px] rounded-full bg-blue-200/30 blur-3xl dark:bg-blue-900/20" />
        <div className="absolute right-1/4 top-20 h-[400px] w-[400px] rounded-full bg-emerald-200/30 blur-3xl dark:bg-emerald-900/20" />
      </div>

      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-600 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-400">
              <Sparkles className="h-4 w-4" />
              Premium Educational Resources
            </div>
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white sm:text-5xl lg:text-6xl">
              Empowering Teachers with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
                Premium Educational Resources
              </span>
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400">
              Save hundreds of hours with our curated collection of lesson plans, worksheets, presentations, and templates. Everything a teacher needs, in one bundle.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/product/teacher-ultimate-bundle">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Product
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                Secure License System
              </div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-blue-500" />
                Instant Downloads
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl dark:border-gray-800 dark:bg-gray-900">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex items-center justify-center"
              >
                <div className="flex h-48 w-48 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-emerald-500">
                  <BookOpen className="h-24 w-24 text-white" />
                </div>
              </motion.div>
              <div className="mt-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Teacher Ultimate Bundle</h3>
                <p className="mt-1 text-sm text-gray-500">500+ resources · Lesson plans · Worksheets</p>
                <div className="mt-4 inline-flex items-center gap-2">
                  <span className="text-3xl font-bold text-blue-600">₱99</span>
                  <span className="text-sm text-gray-400 line-through">₱499</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
