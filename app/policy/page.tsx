import Navbar from "@/components/Navbar";

export default function Policy() {
  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-16 space-y-10">
        <div>
          <h1 className="font-display text-3xl font-bold">Policies</h1>
          <p className="text-white/60 mt-2 text-sm">Last updated: Today</p>
        </div>

        {[
          {
            t: "Terms of Service",
            b: "By registering you agree to pay accurately and upload genuine payment proof. Any tampered or duplicated screenshots result in immediate account suspension.",
          },
          {
            t: "Refund Policy",
            b: "All sales are final once activation is complete. If a payment was made but service was not delivered due to our error, contact WhatsApp 0707042220 within 24 hours for a correction or refund.",
          },
          {
            t: "Privacy Policy",
            b: "We collect: full name, phone number, and payment screenshots you upload. Data is stored securely on Firebase. We never sell your data. Screenshots are only visible to you and our admin (WATCH).",
          },
          {
            t: "Delivery Policy",
            b: "After your screenshot is approved, contact our WhatsApp 0707042220 to receive your package personally. Premium files are delivered uniquely to each client.",
          },
          {
            t: "Prohibited Use",
            b: "Do not upload other people's screenshots. Do not share premium files you received. Do not attempt to bypass payment verification.",
          },
        ].map((s) => (
          <div key={s.t}>
            <h2 className="font-display text-xl font-semibold text-airtel-gold">{s.t}</h2>
            <p className="mt-2 text-white/70 leading-relaxed">{s.b}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
