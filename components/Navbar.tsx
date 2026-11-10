"use client";
import Link from "next/link";
import Logo from "./Logo";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-airtel-charcoal/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Logo size={34} />
          <span className="font-display font-semibold text-sm sm:text-base tracking-wide">
            A.A.M <span className="text-airtel-gold">CASH KING1</span>
          </span>
        </Link>
        
        <nav className="flex items-center gap-3 sm:gap-4 text-sm">
          <Link href="/about" className="text-white/70 hover:text-white hidden sm:inline">About</Link>
          <Link href="/policy" className="text-white/70 hover:text-white hidden sm:inline">Policy</Link>
          
          {user ? (
            <>
              <Link href="/dashboard" className="text-white/70 hover:text-white">Dashboard</Link>
              <button onClick={handleLogout} className="text-white/60 hover:text-white border border-white/20 px-3 py-1.5 rounded text-xs">Logout</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-white/70 hover:text-white">Login</Link>
              <Link href="/register" className="btn-airtel rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm">Get Started</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
