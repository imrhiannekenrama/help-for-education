// App-wide constants for Help for Education

export const SITE_NAME = "Help for Education";
export const TAGLINE = "Premium Digital Resources for Educators";
export const SITE_URL = "https://help-for-education.vercel.app";
export const FACEBOOK_PAGE = "https://facebook.com/helpforeducation";
export const CONTACT_EMAIL = "support@helpforeducation.org";

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/#products" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "FAQ", href: "/#faq" },
];

export const FOOTER_LINKS = {
  Product: [
    { label: "Browse Products", href: "/#products" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "FAQ", href: "/#faq" },
  ],
  Account: [
    { label: "Admin Login", href: "/admin/login" },
  ],
  Support: [
    { label: "Facebook Page", href: "https://facebook.com/helpforeducation" },
    { label: "Contact", href: "mailto:support@helpforeducation.org" },
  ],
};

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Codes", href: "/admin/codes", icon: "Key" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];

export const CODE_REGEX = /^H4E-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export const FAQS = [
  {
    question: "How do I get a download code?",
    answer: "Message us on our Facebook page to place your order. After you pay via GCash, we'll send you a unique download code that you can use on this site.",
  },
  {
    question: "How do I download my product?",
    answer: "Browse to the product page, enter the code we gave you in the 'Enter Download Code' box, and click Download. You'll get instant access to the file.",
  },
  {
    question: "Can I use the same code for multiple products?",
    answer: "No. Each code is valid for one specific product and can only be used once. Once you download, the code is consumed and cannot be reused.",
  },
  {
    question: "How long does payment take?",
    answer: "After you send payment via GCash to our Facebook page, we typically send your code within 1-24 hours.",
  },
  {
    question: "I lost my code. What do I do?",
    answer: "Message us on our Facebook page with your payment reference and we'll resend your code.",
  },
  {
    question: "Can I download again after using my code?",
    answer: "Yes! Your code unlocks the download link. Save the link we show you — you can re-download from it anytime.",
  },
];
