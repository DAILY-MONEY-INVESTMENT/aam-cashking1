"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { auth, db } from "@/lib/firebase/client";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { PACKAGES } from "@/lib/packages";
import { signOut } from "firebase/auth";

function DashboardInner() {
  const params = useSearchParams();
  const presetPkg = params.get("p");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState(presetPkg || PACKAGES[0].key);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  const activePackage = PACKAGES.find(p => p.key === selectedPkg);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const handleMarzPay = async () => {
    if (!phone) { setNote("Enter phone number"); return; }
    setLoading(true);
    setNote("Sending prompt to your phone...");
    try {
      const res = await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone,
          amount: activePackage?.amount,
          description: activePackage?.name,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setNote("Prompt sent! Enter your PIN on your phone.");
      } else {
        setNote("Error: " + data.error);
      }
    } catch (e: any) {
      setNote("Failed to connect");
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-4xl mx-auto px-4 py-12 space-y-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold">My Dashboard</h1>
          <button onClick={() => signOut(auth)} className="text-sm text-white/60 hover:text-white border border-white/20 px-3 py-1 rounded">Logout</button>
        </div>

        <div className="card-glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold">Pay with MarzPay</h2>
          
          <div className="mt-4 flex flex-col gap-4">
            <div className="w-full">
              <label className="text-xs text-white/50 mb-1 block">Select Package</label>
              <select value={selectedPkg} onChange={(e) => setSelectedPkg(e.target.value)}
                className="w-full rounded-md bg-airtel-ink border border-white/10 px-4 py-3 text-sm outline-none text-white">
                {PACKAGES.map((p) => (
                  <option key={p.key} value={p.key}>{p.name} - UGX {p.amount.toLocaleString()}</option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="text-xs text-white/50 mb-1 block">Phone Number (for PIN prompt)</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="07XXXXXXXX"
                className="w-full rounded-md bg-white/5 border border-white/10 px-4 py-3 text-sm outline-none focus:border-airtel-gold/60" />
            </div>

            <button onClick={handleMarzPay} disabled={loading}
              className="btn-airtel rounded-md px-6 py-3 mt-2 disabled:opacity-50 w-full">
              {loading ? "Sending..." : `Pay UGX ${activePackage?.amount.toLocaleString()} with MarzPay`}
            </button>
          </div>
          {note && <p className="text-airtel-gold text-sm mt-3">{note}</p>}
        </div>

        <div>
          <h2 className="font-display text-lg font-semibold mb-4">My Orders</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="card-glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{o.packageName}</p>
                  <p className="text-xs text-white/50 mt-1">{o.orderCode} - UGX {o.amount?.toLocaleString()}</p>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full w-fit ${
                  o.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                  o.status === "rejected" ? "bg-red-500/15 text-red-400" :
                  "bg-airtel-gold/15 text-airtel-gold"
                }`}>{o.status.toUpperCase()}</span>
              </div>
            ))}
            {orders.length === 0 && <p className="text-white/40 text-sm">No orders yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Dashboard() {
  return <AuthGuard><Suspense fallback={<div className="text-white text-center mt-10">Loading...</div>}><DashboardInner /></Suspense></AuthGuard>;
}
