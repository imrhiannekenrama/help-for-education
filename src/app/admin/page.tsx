"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, Key, Download, Users, ArrowRight, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalProducts: 0, totalCodes: 0, usedCodes: 0, unusedCodes: 0 });
  const [recentCodes, setRecentCodes] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      // Check auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }

      // Check admin
      const { data: adminData } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
      if (!adminData) { router.push("/admin/login"); return; }

      // Load stats
      const { count: productCount } = await supabase.from("products").select("*", { count: "exact", head: true });
      const { count: codeCount } = await supabase.from("codes").select("*", { count: "exact", head: true });
      const { count: usedCount } = await supabase.from("codes").select("*", { count: "exact", head: true }).eq("status", "used");
      const { count: unusedCount } = await supabase.from("codes").select("*", { count: "exact", head: true }).eq("status", "unused");

      setStats({
        totalProducts: productCount || 0,
        totalCodes: codeCount || 0,
        usedCodes: usedCount || 0,
        unusedCodes: unusedCount || 0,
      });

      // Recent codes
      const { data: codes } = await supabase.from("codes").select("code, product_name, status, created_at, used_at").order("created_at", { ascending: false }).limit(10);
      setRecentCodes(codes || []);
      setLoading(false);
    }
    loadData();
  }, [router]);

  if (loading) {
    return <AdminLayout><div className="flex justify-center pt-20"><Spinner /></div></AdminLayout>;
  }

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "from-blue-500 to-blue-600" },
    { label: "Total Codes", value: stats.totalCodes, icon: Key, color: "from-emerald-500 to-emerald-600" },
    { label: "Used Codes", value: stats.usedCodes, icon: Download, color: "from-orange-500 to-orange-600" },
    { label: "Unused Codes", value: stats.unusedCodes, icon: TrendingUp, color: "from-purple-500 to-purple-600" },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your products and download codes.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((s) => (
            <Card key={s.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{s.label}</p>
                    <p className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{s.value}</p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.color} text-white`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Codes</h2>
            <Link href="/admin/codes" className="inline-flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentCodes.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No codes yet. Generate some from the Codes tab.</TableCell></TableRow>
                ) : recentCodes.map((c) => (
                  <TableRow key={c.code}>
                    <TableCell className="font-mono text-xs">{c.code}</TableCell>
                    <TableCell>{c.product_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={c.status === "used" ? "destructive" : "default"}>{c.status === "used" ? "Used" : "Unused"}</Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
