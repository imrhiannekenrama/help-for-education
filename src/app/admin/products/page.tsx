"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Package, Edit, Trash2, UploadCloud, File as FileIcon, X, Link2 } from "lucide-react";
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

const FILE_BUCKET = "product-files";

interface ProductFile {
  id: string;
  file_name: string;
  storage_path: string;
  file_size: string | null;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
  file_size: string;
  download_url: string | null;
  storage_path: string | null;
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
  const [uploadMode, setUploadMode] = useState<"file" | "link">("file");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [existingFiles, setExistingFiles] = useState<ProductFile[]>([]);
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
    setUploadMode("file");
    setSelectedFiles([]);
    setExistingFiles([]);
    setForm({ name: "", description: "", price: "", image: "", file_size: "", download_url: "", features: "", bonuses: "" });
    setOpen(true);
  }

  async function openEdit(p: Product) {
    setEditing(p);
    setSelectedFiles([]);
    setForm({
      name: p.name, description: p.description, price: String(p.price), image: p.image || "",
      file_size: p.file_size || "", download_url: p.download_url || "",
      features: (p.features || []).join(", "), bonuses: (p.bonuses || []).join(", "),
    });
    const { data: files } = await supabase
      .from("product_files")
      .select("id, file_name, storage_path, file_size")
      .eq("product_id", p.id)
      .order("created_at", { ascending: true });
    setExistingFiles(files || []);
    setUploadMode(files && files.length > 0 ? "file" : (p.download_url ? "link" : "file"));
    setOpen(true);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setSelectedFiles((prev) => [...prev, ...files]);
  }

  function removeSelectedFile(idx: number) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== idx));
  }

  async function removeExistingFile(id: string) {
    const { error } = await supabase.from("product_files").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error["message"], variant: "destructive" });
    } else {
      setExistingFiles((prev) => prev.filter((f) => f.id !== id));
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      let downloadUrl: string | null = null;
      let storagePath: string | null = null;

      if (uploadMode === "file") {
        if (selectedFiles.length === 0 && existingFiles.length === 0) {
          throw new Error("Please upload at least one file.");
        }
        downloadUrl = null;
        storagePath = null;
      } else {
        if (!form.download_url.trim()) throw new Error("Please enter a download link.");
        downloadUrl = form.download_url.trim();
        storagePath = null;
      }

      const payload = {
        name: form.name, slug, description: form.description, price: parseFloat(form.price) || 0,
        image: form.image || null, file_size: form.file_size || null,
        download_url: downloadUrl, storage_path: storagePath,
        features: form.features ? form.features.split(",").map((s) => s.trim()).filter(Boolean) : [],
        bonuses: form.bonuses ? form.bonuses.split(",").map((s) => s.trim()).filter(Boolean) : [],
        is_active: true,
      };

      let productId: string;

      if (editing) {
        const { data, error } = await supabase.from("products").update(payload).eq("id", editing.id).select().single();
        if (error) throw error;
        productId = data.id;
        toast({ title: "Product Updated", description: `${form.name} has been updated.` });
      } else {
        const { data, error } = await supabase.from("products").insert(payload).select().single();
        if (error) throw error;
        productId = data.id;
        toast({ title: "Product Added", description: `${form.name} has been created.` });
      }

      if (uploadMode === "file" && selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          const path = `${slug}/${Date.now()}_${safeName}`;
          const { error: uploadError } = await supabase.storage.from(FILE_BUCKET).upload(path, file, { upsert: true });
          if (uploadError) throw uploadError;

          const { error: dbError } = await supabase.from("product_files").insert({
            product_id: productId,
            file_name: file.name,
            storage_path: path,
            file_size: file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`,
          });
          if (dbError) throw dbError;
        }
      }

      if (uploadMode === "link" && editing) {
        const { error: delError } = await supabase.from("product_files").delete().eq("product_id", editing.id);
        if (delError) console.warn("Could not clean up old files:", delError);
      }

      setOpen(false);
      fetchProducts();
    } catch (err: any) {
      toast({ title: "Error", description: err["message"] || "Could not save product.", variant: "destructive" });
    }
    setSaving(false);
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This will also delete all its codes and files.`)) return;
    await supabase.from("product_files").delete().eq("product_id", id);
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error["message"], variant: "destructive" });
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
                <TableHead>Files</TableHead>
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
                  <TableCell className="max-w-[200px] truncate text-xs text-gray-500">
                    {p.storage_path || p.download_url ? (
                      p.storage_path ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <FileIcon className="h-3 w-3" /> Uploaded file
                        </span>
                      ) : (p.download_url || "—")
                    ) : (
                      <span className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400">
                        <FileIcon className="h-3 w-3" /> Multiple files
                      </span>
                    )}
                  </TableCell>
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
              <Label>Product Files</Label>
              <div className="mt-1.5 flex gap-2">
                <button type="button" onClick={() => setUploadMode("file")} className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${uploadMode === "file" ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>
                  <UploadCloud className="mr-1.5 inline h-4 w-4" /> Upload Files
                </button>
                <button type="button" onClick={() => setUploadMode("link")} className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${uploadMode === "link" ? "border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300" : "border-gray-200 text-gray-500 dark:border-gray-700"}`}>
                  <Link2 className="mr-1.5 inline h-4 w-4" /> External Link
                </button>
              </div>

              {uploadMode === "file" ? (
                <div className="mt-3 space-y-3">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-blue-700 dark:text-gray-300"
                  />
                  <p className="text-xs text-gray-400">
                    Upload multiple files (max 50MB each). Split large products into parts — the buyer gets all files at once.
                  </p>

                  {existingFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">Already uploaded:</p>
                      {existingFiles.map((f) => (
                        <div key={f.id} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <FileIcon className="h-4 w-4 text-emerald-500" />
                            <span className="truncate">{f.file_name}</span>
                            {f.file_size && <span className="text-xs text-gray-400">({f.file_size})</span>}
                          </div>
                          <button type="button" onClick={() => removeExistingFile(f.id)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedFiles.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-500">New files to upload:</p>
                      {selectedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-700">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <FileIcon className="h-4 w-4 text-blue-500" />
                            <span className="truncate">{f.name}</span>
                            <span className="text-xs text-gray-400">({f.size > 1024 * 1024 ? `${(f.size / (1024 * 1024)).toFixed(1)} MB` : `${(f.size / 1024).toFixed(0)} KB`})</span>
                          </div>
                          <button type="button" onClick={() => removeSelectedFile(i)} className="rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950">
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-3">
                  <Input value={form.download_url} onChange={(e) => setForm({ ...form, download_url: e.target.value })} placeholder="https://drive.google.com/file/d/..." />
                  <p className="mt-1.5 text-xs text-gray-400">This link is only revealed to customers with a valid code.</p>
                </div>
              )}
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
