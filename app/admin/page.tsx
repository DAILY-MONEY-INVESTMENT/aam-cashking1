"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { db, auth } from "@/lib/firebase/client";
import { collection, onSnapshot, doc, updateDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { signOut } from "firebase/auth";

function AdminInner() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalEarned: 0, approved: 0, pending: 0, rejected: 0, totalOrders: 0 });
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const unsubOrders = onSnapshot(query(collection(db, "orders"), orderBy("createdAt", "desc")), (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setOrders(list);
      const s = list.reduce((acc: any, o: any) => {
        if (o.status === "approved") { acc.totalEarned += o.amount || 0; acc.approved += 1; }
        if (o.status === "pending") acc.pending += 1;
        if (o.status === "rejected") acc.rejected += 1;
        acc.totalOrders += 1;
        return acc;
      }, { totalEarned: 0, approved: 0, pending: 0, rejected: 0, totalOrders: 0 });
      setStats(s);
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setTotalUsers(snap.docs.filter((d) => d.data().role === "client").length);
    });

    return () => { unsubOrders(); unsubUsers(); };
  }, []);

  const review = async (id: string, status: "approved" | "rejected") => {
    await updateDoc(doc(db, "orders", id), { status, reviewedAt: serverTimestamp() });
  };

  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-airtel-gold">WATCH - Admin Panel</h1>
          <button onClick={() => signOut(auth)} className="text-sm text-white/60 hover:text-white border border-white/20 px-3 py-1 rounded">Logout</button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat label="Total Earned (UGX)" value={stats.totalEarned.toLocaleString()} accent />
          <Stat label="Approved Orders" value={stats.approved} />
          <Stat label="Pending Orders" value={stats.pending} />
          <Stat label="Registered Clients" value={totalUsers} />
        </div>

        <div className="card-glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-4">All Orders ({stats.totalOrders})</h2>
          <div className="space-y-3">
            {orders.map((o) => (
              <div key={o.id} className="rounded-lg border border-white/10 p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">{o.packageName}</p>
                  <p className="text-xs text-white/50 mt-1">{o.orderCode} - UGX {o.amount?.toLocaleString()}</p>
                  {o.screenshotUrl && (
                    <a href={o.screenshotUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-airtel-gold underline mt-2 inline-block">
                      View Payment Screenshot
                    </a>
                  )}
                </div>
                <span className={`text-xs px-3 py-1 rounded-full w-fit ${
                  o.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                  o.status === "rejected" ? "bg-red-500/15 text-red-400" :
                  "bg-airtel-gold/15 text-airtel-gold"
                }`}>{o.status.toUpperCase()}</span>
                {o.status === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => review(o.id, "approved")}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded px-4 py-2 font-medium">Approve</button>
                    <button onClick={() => review(o.id, "rejected")}
                      className="text-xs bg-red-700 hover:bg-red-600 text-white rounded px-4 py-2 font-medium">Reject</button>
                  </div>
                )}
              </div>
            ))}
            {orders.length === 0 && <p className="text-white/40 text-sm">No orders yet.</p>}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value, accent }: { label: string; value: any; accent?: boolean }) {
  return (
    <div className="card-glass rounded-xl p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className={`mt-2 text-2xl font-bold ${accent ? "text-airtel-gold" : "text-white"}`}>{value}</p>
    </div>
  );
}

export default function Admin() {
  return <AuthGuard requireAdmin><AdminInner /></AuthGuard>;
}
