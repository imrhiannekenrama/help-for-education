"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Key, Package, Settings, LogOut, Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Key, Package, Settings,
};

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      const { data } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
      if (!data) { router.push("/admin/login"); return; }
      setEmail(session.user.email || null);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center bg-gray-900"><div className="animate-pulse text-gray-500">Loading admin panel...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-gray-200 bg-gray-900 lg:flex flex-col dark:border-gray-800">
        <div className="px-6 py-6">
          <Link href="/"><Logo /></Link>
          <span className="mt-1 ml-1 inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600 dark:bg-red-950 dark:text-red-400">ADMIN</span>
        </div>
        <nav className="flex-1 px-3 py-2">
          {ADMIN_NAV.map((item) => {
            const Icon = iconMap[item.icon];
            const active = pathname === item.href;
            return (
              <Link key={item.label} href={item.href} className={cn("mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors", active ? "bg-blue-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white")}>
                {Icon && <Icon className="h-5 w-5" />}{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-gray-800 p-4">
          <div className="mb-2 truncate text-sm text-gray-400">{email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-red-400 hover:bg-red-950" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden">
        <div className="sticky top-0 z-40 border-b border-gray-200 bg-gray-900 px-4 py-3 flex items-center justify-between dark:border-gray-800">
          <Link href="/admin"><Logo /><span className="ml-1 inline-block rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-600">ADMIN</span></Link>
          <button onClick={() => setOpen(!open)} className="rounded-lg p-2 text-gray-300 hover:bg-gray-800">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {open && (
          <div className="border-b border-gray-800 bg-gray-900 px-4 py-4">
            {ADMIN_NAV.map((item) => {
              const Icon = iconMap[item.icon];
              const active = pathname === item.href;
              return (
                <Link key={item.label} href={item.href} onClick={() => setOpen(false)} className={cn("mb-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium", active ? "bg-blue-600 text-white" : "text-gray-400")}>
                  {Icon && <Icon className="h-5 w-5" />}{item.label}
                </Link>
              );
            })}
            <Button variant="ghost" size="sm" className="mt-2 w-full justify-start text-red-400" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        )}
      </div>

      <div className="lg:pl-64">
        <main className="px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
