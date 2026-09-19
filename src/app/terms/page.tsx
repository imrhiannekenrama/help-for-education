"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { FACEBOOK_PAGE } from "@/lib/constants";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Terms of Service</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: September 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. About Our Store</h2>
              <p className="mt-2">Help for Education sells digital products, including software applications and teaching resources. All products are delivered electronically through this website. No physical items are shipped.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. How Purchases Work</h2>
              <p className="mt-2">Orders are processed manually. You choose a product, message us on Facebook Messenger, and pay via your preferred payment method (such as GCash). After payment is confirmed, we send you a unique code. You enter that code on the product page to receive your download or license key.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. Codes and Redemption</h2>
              <p className="mt-2">Each code is single-use and valid only for the product it was issued for. Once a code is redeemed, it cannot be reused, transferred, or refunded. Keep your code private: anyone with your code can use it before you do.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. License Keys and Subscriptions</h2>
              <p className="mt-2">App licenses are valid for the subscription period stated on the product page. When your subscription expires, you must purchase a new code to receive a new license key. License keys are for your personal or classroom use and may not be shared or resold.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Refunds</h2>
              <p className="mt-2">Because our products are digital and delivered instantly, all sales are final once a code has been redeemed. If you experience a genuine problem with a product (such as a corrupted file or an invalid code), contact us on Messenger and we will make it right.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Acceptable Use</h2>
              <p className="mt-2">You may not attempt to bypass code verification, redistribute our files or license keys, or resell our products. Abuse of the system may result in blocked access without refund.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Changes to These Terms</h2>
              <p className="mt-2">We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Contact</h2>
              <p className="mt-2">Questions about these terms? Message us on <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline dark:text-blue-400">Facebook Messenger</a>.</p>
            </section>
          </div>

          <div className="mt-12">
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
            <Link href="/privacy"><Button variant="outline">Privacy Policy</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}