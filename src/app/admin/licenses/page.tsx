"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

interface Product { id: string; name: string; }
interface LicenseKey { id: string; license_key: string; status: string; sold_at: string | null; }

export default function AdminLicenses() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selected, setSelected] = useState("");
  const [keys, setKeys] = useState<LicenseKey[]>([]);
  const [newKeys, setNewKeys] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      const { data } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
      if (!data) { router.push("/admin/login"); return; }
      const { data: prods } = await supabase.from("products").select("id, name").eq("is_license", true).order("created_at", { ascending: false });
      setProducts(prods || []);
      if (prods && prods.length > 0) setSelected(prods[0].id);
      setLoading(false);
    }
    init();
  }, [router]);

  useEffect(() => {
    if (selected) fetchKeys(selected);
  }, [selected]);

  async function fetchKeys(productId: string) {
    const { data } = await supabase.from("license_keys").select("id, license_key, status, sold_at").eq("product_id", productId).order("created_at", { ascending: false });
    setKeys(data || []);
  }

  async function addKeys() {
    const list = newKeys.split(/[\n,]+/).map((s) => s.trim()).filter(Boolean);
    if (!selected || list.length === 0) return;
    setAdding(true);
    const rows = list.map((k) => ({ product_id: selected, license_key: k }));
    const { error } = await supabase.from("license_keys").insert(rows);
    if (error) {
      toast({ title: "Error", description: error["message"], variant: "destructive" });
    } else {
      toast({ title: "Keys Added", description: list.length + " license key(s) added." });
      setNewKeys("");
      fetchKeys(selected);
    }
    setAdding(false);
  }

  async function deleteKey(id: string) {
    const { error } = await supabase.from("license_keys").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error["message"], variant: "destructive" });
    } else {
      setKeys((prev) => prev.filter((k) => k.id !== id));
    }
  }

  if (loading) {
    return <AdminLayout><div className="flex justify-center pt-20"><Spinner /></div></AdminLayout>;
  }

  const available = keys.filter((k) => k.status === "available").length;

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">License Keys</h1>
        <p className="mt-1 text-sm text-gray-500">Manage the license key pool for subscription products.</p>

        {products.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-10 text-center dark:border-gray-800 dark:bg-gray-900">
            <KeyRound className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-4 text-gray-500">No license products yet. Create a product and check the &quot;delivers a license key&quot; option first.</p>
          </div>
        ) : (
          <>
            <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
              <Label htmlFor="product">Product</Label>
              <select id="product" value={selected} onChange={(e) => setSelected(e.target.value)} className="mt-1.5 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <div className="mt-4 flex items-center gap-3 text-sm">
                <Badge>{available} available</Badge>
                <Badge variant="secondary">{keys.length - available} sold</Badge>
              </div>

              <Label htmlFor="newkeys" className="mt-4 block">Add License Keys (one per line)</Label>
              <textarea id="newkeys" value={newKeys} onChange={(e) => setNewKeys(e.target.value)} className="mt-1.5 flex min-h-[100px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="CHM-XXXX-XXXX-XXXX" />
              <Button onClick={addKeys} disabled={adding || !newKeys.trim()} className="mt-3"><Plus className="mr-2 h-4 w-4" /> Add Keys</Button>
            </div>

            <div className="mt-6 rounded-2xl border border-gray-200 bg-white overflow-hidden dark:border-gray-800 dark:bg-gray-900">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>License Key</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sold At</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {keys.length === 0 ? (
                    <TableRow><TableCell colSpan={4} className="text-center text-gray-400 py-8">No keys yet. Add some above.</TableCell></TableRow>
                  ) : keys.map((k) => (
                    <TableRow key={k.id}>
                      <TableCell className="font-mono text-xs">{k.license_key}</TableCell>
                      <TableCell><Badge variant={k.status === "available" ? "default" : "secondary"}>{k.status === "available" ? "Available" : "Sold"}</Badge></TableCell>
                      <TableCell className="text-xs text-gray-500">{k.sold_at ? new Date(k.sold_at).toLocaleString() : "-"}</TableCell>
                      <TableCell>
                        <button onClick={() => deleteKey(k.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
