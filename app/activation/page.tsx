import Link from "next/link";
import Navbar from "@/components/Navbar";
import { PACKAGES } from "@/lib/packages";

export default function Activation() {
  const pkg = PACKAGES.find((p) => p.key === "airtel_unlimited");

  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-md mx-auto px-4 py-12">
        <h1 className="font-display text-2xl font-bold mb-2">Activation</h1>
        <p className="text-white/60 text-sm mb-6">Activate your Airtel Unlimited Internet.</p>
        
        {pkg && (
          <div className="card-glass rounded-2xl p-6">
            <span className="text-[11px] tracking-[0.25em] uppercase text-airtel-gold">{pkg.tag}</span>
            <h3 className="mt-3 font-display text-xl font-semibold">{pkg.name}</h3>
            <div className="mt-4 flex items-baseline gap-1">
              <span className="text-white/60 text-sm">UGX</span>
              <span className="text-3xl font-bold text-airtel-gold">{pkg.amount.toLocaleString()}</span>
            </div>
            <p className="mt-4 text-sm text-white/70">{pkg.blurb}</p>
            <Link href={`/dashboard?p=${pkg.key}`} className="btn-airtel rounded-md mt-6 text-center py-3 block">
              Buy Now
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
