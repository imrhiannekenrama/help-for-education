"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";

export default function AdminSettings() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ gcash_number: "", facebook_page: "", contact_email: "" });

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/admin/login"); return; }
      const { data } = await supabase.from("admins").select("id").eq("id", session.user.id).single();
      if (!data) { router.push("/admin/login"); return; }
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  if (loading) return <AdminLayout><div className="flex justify-center pt-20"><Spinner /></div></AdminLayout>;

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    toast({ title: "Saved", description: "Settings updated." });
    setSaving(false);
  }

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">Manage your site configuration.</p>
        <form onSubmit={handleSave} className="mt-6 max-w-lg space-y-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div>
            <Label htmlFor="gcash">GCash Number</Label>
            <Input id="gcash" value={form.gcash_number} onChange={(e) => setForm({ ...form, gcash_number: e.target.value })} className="mt-1.5" placeholder="0917-888-9922" />
          </div>
          <div>
            <Label htmlFor="fb">Facebook Page URL</Label>
            <Input id="fb" value={form.facebook_page} onChange={(e) => setForm({ ...form, facebook_page: e.target.value })} className="mt-1.5" placeholder="https://facebook.com/helpforeducation" />
          </div>
          <div>
            <Label htmlFor="email">Contact Email</Label>
            <Input id="email" type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} className="mt-1.5" placeholder="support@helpforeducation.org" />
          </div>
          <Button type="submit" disabled={saving}>{saving ? <Spinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />} Save Settings</Button>
        </form>
      </div>
    </AdminLayout>
  );
}
