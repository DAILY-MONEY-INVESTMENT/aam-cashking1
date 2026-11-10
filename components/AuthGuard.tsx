"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

export default function AuthGuard({ children, requireAdmin = false }: { children: React.ReactNode; requireAdmin?: boolean }) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) { router.push("/login"); return; }
      if (requireAdmin) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.data()?.role !== "admin") { router.push("/dashboard"); return; }
      }
      setReady(true);
    });
    return () => unsub();
  }, [router, requireAdmin]);

  if (!ready) return <div className="min-h-screen bg-airtel-charcoal flex items-center justify-center text-white/50 text-sm">Verifying secure session...</div>;
  return <>{children}</>;
}
