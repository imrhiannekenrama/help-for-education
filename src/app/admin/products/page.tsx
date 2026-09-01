"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, Edit, Trash2, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  file_size: string;
  download_url: string;
  is_active: boolean;
  features: string[];
  bonuses: string[];
}

export default function AdminProducts() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", price: "", image: "", file_size: "", download_url: "", features: "", bonuses: "",
  });

  useEffect(() => {
    checkAuth();
    fetchProducts();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }
    const { data } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
    if (!data) { router.push("/admin/login"); return; }
  }

  async function fetchProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm({ name: "", description: "", price: "", image: "", file_size: "", download_url: "", features: "", bonuses: "" });
    setOpen(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name, description: p.description, price: String(p.price), image: p.image || "",
      file_size: p.file_size || "", download_url: p.download_url || "",
      features: (p.features || []).join(", "), bonuses: (p.bonuses || []).join(", "),
    });
    setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      const payload = {
        name: form.name,
        slug,
        description: form.description,
        price: parseFloat(form.price) || 0,
        image: form.image || null,
        file_size: form.file_size || null,
        download_url: form.download_url,
        features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
        bonuses: form.bonuses ? form.bonuses.split(",").map((s) => s.trim()).filter(Boolean) : [],
        is_active: true,
      };

      if (editing) {
        const { error } = await supabase.from("products").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast({ title: "Product Updated", description: `${form.name} has been updated.` });
      } else {
        const { error } = await supabase.from("products").insert(payload);
        if (error) throw error;
        toast({ title: "Product Added", description: `${form.name} has been created.` });
      }
      setOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Could not save product.", variant: "destructive" });
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all its codes.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: `${name} has been deleted.` });
      fetchProducts();
    }
  }

  if (loading) {
    return <AdminLayout><div className="flex justify-center pt-20"><Spinner /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h1>
            <p className="mt-1 text-sm text-gray-500">Manage your digital products.</p>
          </div>
          <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" /> Add Product</Button>
        </div>

        <div className="mt-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Download Link</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="text-center text-gray-400 py-8">No products yet. Click "Add Product" to create one.</TableCell></TableRow>
              ) : products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500">
                        <Package className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>₱{p.price}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-gray-500">{p.download_url || "—"}</TableCell>
                  <TableCell><Badge variant={p.is_active ? "default" : "secondary"}>{p.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(p)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"><Edit className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(p.id, p.name)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4 py-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" placeholder="Teacher Ultimate Bundle" required />
            </div>
            <div>
              <Label htmlFor="price">Price (₱)</Label>
              <Input id="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="mt-1.5" placeholder="99" required />
            </div>
            <div>
              <Label htmlFor="desc">Description</Label>
              <textarea id="desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-1.5 flex min-h-[60px] w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Short product description..." required />
            </div>
            <div>
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input id="image" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} className="mt-1.5" placeholder="https://..." />
            </div>
            <div>
              <Label htmlFor="filesize">File Size (optional)</Label>
              <Input id="filesize" value={form.file_size} onChange={(e) => setForm({ ...form, file_size: e.target.value })} className="mt-1.5" placeholder="2.4 GB" />
            </div>
            <div>
              <Label htmlFor="download">Download Link (Google Drive, Dropbox, etc.)</Label>
              <Input id="download" value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} className="mt-1.5" placeholder="https://drive.google.com/file/d/..." required />
              <p className="mt-1 text-xs text-gray-400">This link is only revealed to customers with a valid code.</p>
            </div>
            <div>
              <Label htmlFor="features">Features (comma-separated)</Label>
              <Input id="features" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="mt-1.5" placeholder="100+ Lesson Plans, 200+ Worksheets" />
            </div>
            <div>
              <Label htmlFor="bonuses">Bonuses (comma-separated)</Label>
              <Input id="bonuses" value={form.bonuses} onChange={(e) => setForm({ ...form, bonuses: e.target.value })} className="mt-1.5" placeholder="150+ Bonus Materials, Free updates" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? <Spinner className="mr-2" /> : null} Save Product</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
