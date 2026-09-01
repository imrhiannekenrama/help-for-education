import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Help for Education — Premium Digital Resources for Filipino Educators",
  description: "Premium digital educational resources for teachers. Lesson plans, worksheets, presentations, templates, and more.",
  keywords: ["education", "teaching resources", "lesson plans", "worksheets", "teacher bundle"],
  openGraph: {
    title: "Help for Education",
    description: "Premium Digital Resources for Filipino Educators",
    type: "website",
    url: "https://help-for-education.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "Help for Education",
    description: "Premium Digital Resources for Filipino Educators",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
