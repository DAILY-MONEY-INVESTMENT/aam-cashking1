import Navbar from "@/components/Navbar";

export default function About() {
  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h1 className="font-display text-3xl font-bold">About Us</h1>
        <p className="mt-6 text-white/70 leading-relaxed">
          A.A.M CASH KING1 INTERNETS is a Ugandan digital service provider offering
          Airtel unlimited internet access and curated premium file packages. We
          operate on a simple, accountable model: every payment is verified by a
          human before service is delivered.
        </p>
        <p className="mt-4 text-white/70 leading-relaxed">
          Each transaction is traceable. Each client receives personal delivery on
          WhatsApp. We do not resell credentials we do not control, and we do not
          promise what we cannot deliver.
        </p>
        <h2 className="mt-10 font-display text-xl font-semibold">Contact</h2>
        <p className="mt-3 text-white/70">
          WhatsApp: <span className="text-airtel-gold font-medium">0707042220</span><br />
          Payments accepted: MTN Mobile Money, Airtel Money
        </p>
      </section>
    </main>
  );
}
