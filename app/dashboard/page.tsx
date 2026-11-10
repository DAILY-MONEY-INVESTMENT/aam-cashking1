"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { auth, db, storage } from "@/lib/firebase/client";
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { PACKAGES } from "@/lib/packages";
import { signOut } from "firebase/auth";

function DashboardInner() {
  const params = useSearchParams();
  const presetPkg = params.get("p");
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedPkg, setSelectedPkg] = useState(presetPkg || PACKAGES[0].key);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
    return () => unsub();
  }, []);

  const submitOrder = async () => {
    const user = auth.currentUser;
    if (!user || !file) return;
    const pkg = PACKAGES.find((p) => p.key === selectedPkg)!;
    setUploading(true);
    try {
      const path = `screenshots/${user.uid}/${Date.now()}-${file.name}`;
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      const orderCode = `MZ-${Date.now().toString().slice(-6)}`;
      await addDoc(collection(db, "orders"), {
        orderCode,
        userId: user.uid,
        packageKey: pkg.key,
        packageName: pkg.name,
        amount: pkg.amount,
        status: "pending",
        screenshotUrl: url,
        adminNote: "",
        createdAt: serverTimestamp(),
        reviewedAt: null,
      });
      setNote(`Order ${orderCode} submitted. Await approval.`);
      setFile(null);
    } catch (e: any) {
      setNote("Upload failed: " + e.message);
    }
    setUploading(false);
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
          <h2 className="font-display text-lg font-semibold">Place an Order</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <select value={selectedPkg} onChange={(e) => setSelectedPkg(e.target.value)}
              className="rounded-md bg-airtel-ink border border-white/10 px-4 py-3 text-sm outline-none text-white">
              {PACKAGES.map((p) => (
                <option key={p.key} value={p.key}>
                  {p.name} - UGX {p.amount.toLocaleString()}
                </option>
              ))}
            </select>
            <input type="file" accept="image/jpeg,image/png,application/pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="rounded-md bg-white/5 border border-white/10 px-4 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-airtel-red file:px-3 file:py-1 file:text-white file:text-xs" />
          </div>
          <p className="text-white/50 text-xs mt-3">
            Pay to 0707042220 (MUZAFARU), 0704115459 (MUZAFARU), or 0758710606 (MAYANJA). Upload the screenshot. Max 5MB.
          </p>
          <button onClick={submitOrder} disabled={!file || uploading}
            className="btn-airtel rounded-md px-6 py-3 mt-4 disabled:opacity-50">
            {uploading ? "Uploading..." : "Submit Order"}
          </button>
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
                <div className="flex items-center gap-4">
                  <span className={`text-xs px-3 py-1 rounded-full w-fit ${
                    o.status === "approved" ? "bg-emerald-500/15 text-emerald-400" :
                    o.status === "rejected" ? "bg-red-500/15 text-red-400" :
                    "bg-airtel-gold/15 text-airtel-gold"
                  }`}>{o.status.toUpperCase()}</span>
                  {o.status === "approved" && (
                    <a href={`https://wa.me/256707042220?text=${encodeURIComponent(`Hello, my order ${o.orderCode} is approved. Please send my files.`)}`}
                       target="_blank" rel="noopener noreferrer"
                       className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded font-medium">Get Files on WhatsApp</a>
                  )}
                </div>
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
