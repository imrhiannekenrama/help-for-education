"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;

      // Check admin
      const { data: adminData } = await supabase.from("admins").select("id").eq("id", data.user.id).single();
      if (!adminData) {
        await supabase.auth.signOut();
        throw new Error("Access denied. This account does not have admin privileges.");
      }
      router.push("/admin");
    } catch (err: any) {
      setError(err.message || "Admin authentication failed.");
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md rounded-3xl border border-gray-700 bg-gray-800/50 p-8 backdrop-blur">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="mt-2 text-sm text-gray-400">Restricted access — authorized personnel only</p>
        </div>
        {error && <div className="mb-4 rounded-xl bg-red-900/50 p-3 text-sm text-red-400 border border-red-800">{error}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">Admin Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@helpforeducation.org" className="mt-1.5 bg-gray-800 border-gray-700 text-white placeholder-gray-500" required />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="mt-1.5 bg-gray-800 border-gray-700 text-white placeholder-gray-500" required />
          </div>
          <Button type="submit" size="lg" disabled={loading} className="w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600">
            {loading ? "Authenticating..." : "Authenticate"}
          </Button>
        </form>
        <Link href="/" className="mt-6 block text-center text-sm text-gray-500 hover:text-gray-300">← Back to website</Link>
      </motion.div>
    </div>
  );
}
