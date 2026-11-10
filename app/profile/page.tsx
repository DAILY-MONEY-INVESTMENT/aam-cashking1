"use client";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";
import { auth, db } from "@/lib/firebase/client";
import { doc, getDoc } from "firebase/firestore";

function ProfileInner() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setProfile(snap.data());
      }
    };
    fetchProfile();
  }, []);

  return (
    <main className="min-h-screen bg-airtel-charcoal pb-20">
      <Navbar />
      <section className="max-w-md mx-auto px-4 py-12">
        <h1 className="font-display text-2xl font-bold mb-6">My Profile</h1>
        <div className="card-glass rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Full Name</p>
            <p className="text-lg font-medium mt-1">{profile?.fullName || "Loading..."}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Phone Number</p>
            <p className="text-lg font-medium mt-1">{profile?.phone || "Loading..."}</p>
          </div>
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider">Account Type</p>
            <p className="text-lg font-medium mt-1 capitalize text-airtel-gold">{profile?.role || "Client"}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function Profile() {
  return <AuthGuard><ProfileInner /></AuthGuard>;
}
