"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { phoneToEmail } from "@/lib/packages";

function RegisterInner() {
  const router = useRouter();
  const params = useSearchParams();
  const pkg = params.get("p") || "";
  const [form, setForm] = useState({ full_name: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const phone = form.phone.trim().replace(/\s+/g, "");
    if (!/^(0|\+256)7\d{8}$/.test(phone)) {
      setErr("Enter a valid Ugandan phone (07XXXXXXXX or +2567XXXXXXXX).");
      return;
    }
    if (form.password.length < 6) {
      setErr("Password must be at least 6 characters.");
      return;
    }
    setLoading(true);
    try {
      const normalizedPhone = phone.startsWith("0") ? `+256${phone.slice(1)}` : phone;
      const email = phoneToEmail(normalizedPhone);
      const cred = await createUserWithEmailAndPassword(auth, email, form.password);
      await setDoc(doc(db, "users", cred.user.uid), {
        fullName: form.full_name.trim(),
        phone: normalizedPhone,
        role: "client",
        createdAt: serverTimestamp(),
      });
      router.push(pkg ? `/dashboard?p=${pkg}` : "/dashboard");
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Registration failed.";
      setErr(msg.replace("Firebase: ", ""));
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h1 className="font-display text-2xl font-bold">Create Account</h1>
      <p className="text-white/60 text-sm mt-1">Register with your name, phone, and password.</p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <input type="text" required placeholder="Full name" value={form.full_name}
          onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
        <input type="tel" required placeholder="07XXXXXXXX" value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
        <input type="password" required placeholder="Password (min 6)" value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
        {err && <p className="text-airtel-red text-sm">{err}</p>}
        <button disabled={loading} className="btn-airtel w-full rounded-md py-3 disabled:opacity-50">
          {loading ? "Creating..." : "Create Account"}
        </button>
      </form>
      <p className="text-white/50 text-sm mt-6 text-center">
        Already registered? <Link href="/login" className="text-airtel-gold">Login</Link>
      </p>
    </section>
  );
}

export default function Register() {
  return (
    <main className="min-h-screen bg-airtel-charcoal">
      <Navbar />
      <Suspense fallback={<div className="text-center text-white/50 mt-20">Loading...</div>}>
        <RegisterInner />
      </Suspense>
    </main>
  );
}
