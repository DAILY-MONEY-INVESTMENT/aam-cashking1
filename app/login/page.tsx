"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth } from "@/lib/firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { phoneToEmail } from "@/lib/packages";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ phone: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const phone = form.phone.trim().replace(/\s+/g, "");
    if (!/^(0|\+256)7\d{8}$/.test(phone)) {
      setErr("Enter a valid Ugandan phone.");
      return;
    }
    setLoading(true);
    try {
      const normalizedPhone = phone.startsWith("0") ? `+256${phone.slice(1)}` : phone;
      await signInWithEmailAndPassword(auth, phoneToEmail(normalizedPhone), form.password);
      router.push("/dashboard");
    } catch (e: any) {
      setErr("Invalid phone or password.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-airtel-charcoal">
      <Navbar />
      <section className="max-w-md mx-auto px-4 py-16">
        <h1 className="font-display text-2xl font-bold">Login</h1>
        <p className="text-white/60 text-sm mt-1">Use your registered phone and password.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <input type="tel" required placeholder="07XXXXXXXX" value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
          <input type="password" required placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
          {err && <p className="text-airtel-red text-sm">{err}</p>}
          <button disabled={loading} className="btn-airtel w-full rounded-md py-3 disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
        <p className="text-white/50 text-sm mt-6 text-center">
          New here? <Link href="/register" className="text-airtel-gold">Create account</Link>
        </p>
      </section>
    </main>
  );
}
// force build
