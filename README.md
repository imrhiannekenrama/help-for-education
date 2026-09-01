# Help for Education

> **Empowering educators and learners worldwide with high-quality, verified digital educational resources.**

**Help for Education** is a modern, full-featured digital marketplace built with Next.js 15, React 19, and Supabase. It enables creators to share and monetize educational materials (lesson plans, e-books, software licenses, interactive guides) while offering students and educators seamless access, instant license activation, and secure resource downloads.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router, Server Actions, React 19)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI:** [Tailwind CSS v3](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (Authentication, PostgreSQL Database)
- **Forms & Validation:** [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/)

---

## ✨ Features Overview

- **Digital Resource Marketplace:** Browse, filter, search, and purchase digital educational content.
- **License Management:** Automated license key generation and redemption for digital software or premium resource packs.
- **Secure File Delivery:** Download links stored in database — only revealed to customers who have redeemed a valid license key.
- **Role-Based Access Control:** Role distinctions for standard Customers and platform Administrators.
- **Analytics & Tracking:** Real-time metrics for resource downloads, popular categories, and sales performance.
- **Dark Mode Support:** Built-in light/dark theme switcher powered by Tailwind CSS variables.

---

## 🛠️ Getting Started

### Prerequisites

- **Node.js:** v18.17+ or v20+ recommended
- **Package Manager:** npm, pnpm, or yarn
- **Supabase Account:** A free project on [supabase.com](https://supabase.com)

### 1. Clone & Install Dependencies

```bash
git clone https://github.com/your-org/help-for-education.git
cd help-for-education
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project — note the **Project URL** and **anon key** from Settings > API
3. Go to **SQL Editor** and paste the contents of `supabase-schema.sql` — run it
4. This creates all tables, Row Level Security policies, and default settings

### 3. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.local.example .env.local
```

Open `.env.local` and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## 📁 Project Structure

```text
help-for-education/
├── public/                  # Static assets (favicon, sitemap.xml, robots.txt)
├── src/
│   ├── app/                 # Next.js 15 App Router pages and layouts
│   │   ├── globals.css      # Tailwind base styles and CSS custom properties
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Marketplace home page
│   ├── components/          # Reusable UI & business components
│   │   └── ui/              # shadcn/ui base primitives
│   └── lib/                 # Shared utilities, Supabase client, types
│       ├── supabase.ts      # Supabase client initialization
│       ├── api.ts           # Data access layer
│       └── validations.ts   # Zod form validation schemas
├── supabase-schema.sql      # Database schema + RLS policies (run in Supabase SQL Editor)
├── next.config.js           # Next.js 15 configuration
├── postcss.config.js        # PostCSS configuration with Tailwind
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript compiler configuration
```

---

## 🔑 License Key Format

- **Format:** `H4E-[CATEGORY]-[RANDOM_BLOCK]-[CHECKSUM]`
- **Example:** `H4E-MATH-8F92A-4B2C`

---

## 🔐 Database Security (Row Level Security)

All tables have Row Level Security (RLS) enabled:

- **users:** Users can read/update their own profile. Admins have full access.
- **products:** Public read for active products. Write access restricted to admins.
- **licenses:** Admins manage all licenses. Users can read their own redeemed licenses.
- **downloads:** Users can create/read own download records. Admins see all.
- **settings:** Publicly readable. Admin-only writes.
- **checkouts:** Anyone can create (guest checkout). Admins read/update all.

---

## 🌐 Deployment (Vercel + Supabase)

1. Push your code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import your repository
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Both Supabase and Vercel have generous free tiers — no credit card required to start.

---

## 📄 License

Distributed under the MIT License.
