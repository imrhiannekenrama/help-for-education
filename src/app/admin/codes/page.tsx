"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Key, Plus, Copy, Trash2, Search, Package } from "lucide-react";
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
}

interface CodeRecord {
  id: string;
  code: string;
  product_id: string;
  product_name: string;
  status: string;
  used_at: string | null;
  created_at: string;
}

function generateCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const block = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `H4E-${block()}-${block()}-${block()}`;
}

export default function AdminCodes() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [codes, setCodes] = useState<CodeRecord[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [codeCount, setCodeCount] = useState("10");
  const [generating, setGenerating] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { router.push("/admin/login"); return; }
    const { data } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
    if (!data) { router.push("/admin/login"); return; }
  }

  async function fetchData() {
    const { data: prods } = await supabase.from("products").select("id, name").eq("is_active", true).order("name");
    setProducts(prods || []);
    const { data: codeData } = await supabase.from("codes").select("*").order("created_at", { ascending: false });
    setCodes(codeData || []);
    setLoading(false);
  }

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) {
      toast({ title: "Select a product", description: "Choose a product to generate codes for.", variant: "destructive" });
      return;
    }
    setGenerating(true);
    try {
      const product = products.find((p) => p.id === selectedProduct);
      const count = parseInt(codeCount) || 1;
      const newCodes = Array.from({ length: count }, () => ({
        code: generateCode(),
        product_id: selectedProduct,
        product_name: product?.name || "",
        status: "unused",
      }));

      const { error } = await supabase.from("codes").insert(newCodes);
      if (error) throw error;

      toast({ title: "Codes Generated", description: `${count} code(s) created for ${product?.name}.` });
      setOpen(false);
      setSelectedProduct("");
      setCodeCount("10");
      fetchData();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
    setGenerating(false);
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code);
    toast({ title: "Copied!", description: `${code} copied to clipboard.` });
  }

  async function deleteCode(id: string) {
    if (!confirm("Delete this code?")) return;
    const { error } = await supabase.from("codes").delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Code deleted." });
      setCodes(codes.filter((c) => c.id !== id));
    }
  }

  const filteredCodes = codes.filter((c) => {
    const matchesSearch = c.code.includes(search.toUpperCase()) || (c.product_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <AdminLayout><div className="flex justify-center pt-20"><Spinner /></div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Download Codes</h1>
            <p className="mt-1 text-sm text-gray-500">Generate and manage download codes for your products.</p>
          </div>
          <Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" /> Generate Codes</Button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" placeholder="Search code or product..." />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white">
            <option value="all">All Status</option>
            <option value="unused">Unused</option>
            <option value="used">Used</option>
          </select>
        </div>

        {/* Codes Table */}
        <div className="mt-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Used Date</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCodes.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="text-center text-gray-400 py-8">
                  {codes.length === 0 ? "No codes yet. Click 'Generate Codes' to create some." : "No codes match your search."}
                </TableCell></TableRow>
              ) : filteredCodes.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs font-medium">{c.code}</TableCell>
                  <TableCell>{c.product_name || "—"}</TableCell>
                  <TableCell><Badge variant={c.status === "used" ? "destructive" : "default"}>{c.status === "used" ? "Used" : "Unused"}</Badge></TableCell>
                  <TableCell className="text-xs text-gray-500">{c.used_at ? new Date(c.used_at).toLocaleDateString() : "—"}</TableCell>
                  <TableCell className="text-xs text-gray-500">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button onClick={() => copyCode(c.code)} className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950"><Copy className="h-4 w-4" /></button>
                      <button onClick={() => deleteCode(c.id)} className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Generate Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Generate Download Codes</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleGenerate} className="space-y-4 py-4">
            <div>
              <Label htmlFor="product">Select Product</Label>
              <select id="product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} className="mt-1.5 flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800 dark:text-white" required>
                <option value="">Choose a product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="count">Number of Codes</Label>
              <Input id="count" type="number" value={codeCount} onChange={(e) => setCodeCount(e.target.value)} className="mt-1.5" min="1" max="500" required />
              <p className="mt-1 text-xs text-gray-400">Each code can only be used once for this product.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={generating || !selectedProduct}>
                {generating ? <Spinner className="mr-2" /> : <Key className="mr-2 h-4 w-4" />} Generate
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
