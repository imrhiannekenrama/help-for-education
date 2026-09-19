"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/landing/navbar";
import { Footer } from "@/components/landing/footer";
import { Button } from "@/components/ui/button";
import { FACEBOOK_PAGE } from "@/lib/constants";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-4 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </Link>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Privacy Policy</h1>
          <p className="mt-2 text-sm text-gray-500">Last updated: September 2026</p>

          <div className="mt-10 space-y-8 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">1. Who We Are</h2>
              <p className="mt-2">Help for Education is a small digital store based in the Philippines, selling teaching resources and software applications through this website. This policy explains what personal data we collect and how we use it.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">2. What Data We Collect</h2>
              <p className="mt-2">We keep things minimal. We collect only:</p>
              <ul className="mt-2 list-disc space-y-1 pl-6">
                <li>Redemption records: the codes you redeem and the products you receive, so codes can only be used once.</li>
                <li>Licensing records: which license key was issued to which product, so we can support your subscription.</li>
                <li>Messages you send us on Facebook Messenger when you order, kept only as needed to complete your purchase.</li>
                <li>Basic technical data like browser type, collected automatically by our hosting providers to run the site.</li>
              </ul>
              <p className="mt-2">We do not require an account to buy or redeem, and we never ask for your GCash credentials, password, or payment card details. Payments happen outside this site, directly with you.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">3. How We Use Your Data</h2>
              <p className="mt-2">We use the data above only to: verify your purchase codes, deliver your downloads and license keys, count product installs, prevent abuse (such as code sharing), and answer your support questions.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">4. Service Providers</h2>
              <p className="mt-2">Our site runs on third-party services: Supabase (database and file storage), Vercel (website hosting), and Meta/Facebook (our Messenger page). These providers process data only to run the service, under their own privacy protections. We do not sell, rent, or trade your personal data to anyone.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">5. Data Retention</h2>
              <p className="mt-2">We keep redemption and licensing records for as long as needed to honor subscriptions and prevent fraud. Messenger order chats are kept only as long as needed to complete and support your purchase.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">6. Your Rights</h2>
              <p className="mt-2">Under the Philippine Data Privacy Act (RA 10173), you may ask us what data we hold about you, request a copy, or ask for corrections or deletion where the law allows. Message us on Facebook and we will respond as soon as we can.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">7. Security</h2>
              <p className="mt-2">Downloads are protected by single-use codes and links that expire within minutes. We follow reasonable practices to keep records safe, but no online service can promise absolute security.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">8. Changes to This Policy</h2>
              <p className="mt-2">If we update this policy, we will post the new version on this page with a new date.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">9. Contact</h2>
              <p className="mt-2">Questions or requests about your data? Message us on <a href={FACEBOOK_PAGE} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-600 underline dark:text-blue-400">Facebook Messenger</a>.</p>
            </section>
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link href="/"><Button variant="outline">Back to Home</Button></Link>
            <Link href="/terms"><Button variant="outline">Terms of Service</Button></Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}