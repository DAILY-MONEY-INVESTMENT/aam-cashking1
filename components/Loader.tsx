"use client";
import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Loader() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] bg-airtel-charcoal flex flex-col items-center justify-center transition-opacity duration-500 ${
        hidden ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 rounded-full border-2 border-airtel-gold animate-pulse-ring" />
        <div className="absolute inset-0 rounded-full border-2 border-airtel-red animate-pulse-ring [animation-delay:0.6s]" />
        <div className="relative w-24 h-24 rounded-full bg-white/5 flex items-center justify-center">
          <Logo size={56} />
        </div>
      </div>
      <h1 className="mt-8 font-display text-xl tracking-wide text-white">
        A.A.M <span className="text-airtel-gold">CASH KING1</span> INTERNETS
      </h1>
      <div className="mt-4 h-1 w-48 rounded-full bg-white/10 overflow-hidden">
        <div
          className="h-full w-1/3 bg-gradient-to-r from-airtel-red via-airtel-gold to-airtel-red animate-shimmer"
          style={{ backgroundSize: "500px 100%" }}
        />
      </div>
      <p className="mt-3 text-xs text-white/50 tracking-widest uppercase">
        Initializing secure session
      </p>
    </div>
  );
}
