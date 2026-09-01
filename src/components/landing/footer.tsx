import Link from "next/link";
import { Mail } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { FOOTER_LINKS, SITE_NAME, TAGLINE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900/50">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo />
            <p className="mt-4 text-sm text-gray-500 max-w-xs">{TAGLINE}</p>
            <div className="mt-4 flex gap-3">
              <Link href="#" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 dark:border-gray-700">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="mailto:support@helpforeducation.org" className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:text-blue-600 dark:border-gray-700">
                <Mail className="h-4 w-4" />
              </Link>
            </div>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h4>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-gray-200 pt-6 dark:border-gray-800">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Pay via GCash.
          </p>
        </div>
      </div>
    </footer>
  );
}
