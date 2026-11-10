"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PACKAGES } from "@/lib/packages";
import { db } from "@/lib/firebase/client";
import { collection, onSnapshot } from "firebase/firestore";

export default function Home() {
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "users"), (snap) => {
      setTotalUsers(snap.docs.filter((d) => d.data().role === "client").length);
    });
    return () => unsub();
  }, []);

  return (
    <main className="min-h-screen bg-airtel-charcoal">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-airtel-red/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-airtel-gold/10 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 pt-20 pb-24 text-center">
          <span className="inline-block text-[11px] tracking-[0.3em] uppercase text-airtel-gold border border-airtel-gold/30 rounded-full px-4 py-1">
            Airtel Network &middot; Verified Payments
          </span>
          <h1 className="mt-6 font-display text-4xl sm:text-6xl font-bold leading-tight">
            A.A.M <span className="text-airtel-gold">CASH KING1</span>
            <br />
            INTERNETS
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-white/70 text-base sm:text-lg">
            Unlimited Airtel internet and premium file drops. Pay via Mobile
            Money, upload your proof, get connected. Simple, fast, accountable.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="btn-airtel rounded-md px-6 py-3"
            >
              Create Account
            </Link>
            <Link
              href="#packages"
              className="rounded-md px-6 py-3 border border-white/15 hover:border-airtel-gold/50 transition"
            >
              View Packages
            </Link>
          </div>

          <div className="mt-12 inline-flex items-center gap-3 card-glass rounded-full px-5 py-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70">
              <span className="text-white font-semibold">
                {totalUsers.toLocaleString()}
              </span>{" "}
              clients served
            </span>
          </div>
        </div>
      </section>

      {/* PACKAGES */}
      <section id="packages" className="max-w-6xl mx-auto px-4 pb-24">
        <h2 className="text-center font-display text-3xl font-semibold">
          Our Packages
        </h2>
        <p className="text-center text-white/60 mt-2">
          Pay in Ugandan Shillings via MTN or Airtel Mobile Money
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {PACKAGES.map((p) => (
            <div
              key={p.key}
              className="card-glass rounded-2xl p-6 flex flex-col"
            >
              <span className="text-[11px] tracking-[0.25em] uppercase text-airtel-gold">
                {p.tag}
              </span>
              <h3 className="mt-3 font-display text-xl font-semibold leading-snug">
                {p.name}
              </h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-white/60 text-sm">UGX</span>
                <span className="text-3xl font-bold text-airtel-gold">
                  {p.amount.toLocaleString()}
                </span>
              </div>
              <p className="mt-4 text-sm text-white/70 flex-1">{p.blurb}</p>
              <Link
                href={`/register?p=${p.key}`}
                className="btn-airtel rounded-md mt-6 text-center py-3"
              >
                Buy Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PAYMENT NUMBERS */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="card-glass rounded-2xl p-8">
          <h3 className="font-display text-xl font-semibold">
            Official Payment Numbers
          </h3>
          <p className="text-white/60 text-sm mt-1">
            Send Mobile Money to any of these numbers. Upload screenshot after
            payment for approval.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { num: "0707042220", name: "MUZAFARU" },
              { num: "0704115459", name: "MUZAFARU" },
              { num: "0758710606", name: "MAYANJA" },
            ].map((x) => (
              <div
                key={x.num}
                className="rounded-xl border border-white/10 p-4"
              >
                <p className="text-airtel-gold font-semibold tracking-wide">
                  {x.num}
                </p>
                <p className="text-white/60 text-sm mt-1">{x.name}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50 text-xs mt-4">
            Premium files: pay to MARZ account (contact WhatsApp for account
            details).
          </p>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 text-center text-xs text-white/40">
        &copy; {new Date().getFullYear()} A.A.M CASH KING1 INTERNETS &middot; All
        rights reserved
      </footer>
    </main>
  );
}

