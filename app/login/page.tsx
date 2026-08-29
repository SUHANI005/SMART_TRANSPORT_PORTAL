"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { LogIn, Bus } from "lucide-react";

const DEMO_ACCOUNTS = [
  { label: "Citizen", email: "citizen@demo.in" },
  { label: "Officer", email: "officer@demo.in" },
  { label: "Admin", email: "admin@demo.in" }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      toast.error("Invalid email or password.");
    } else {
      toast.success("Welcome back!");
      router.push("/");
      router.refresh();
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="text-center mb-8">
        <span className="inline-flex bg-brand-600 text-white rounded-2xl p-3 mb-3">
          <Bus size={26} />
        </span>
        <h1 className="text-2xl font-extrabold text-ink-800">Welcome back</h1>
        <p className="text-slate-500 mt-1">Log in to manage your applications</p>
      </div>

      <form onSubmit={onSubmit} className="card p-6 space-y-4">
        <div>
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <div>
          <label className="label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          <LogIn size={18} /> {loading ? "Signing in..." : "Log In"}
        </button>
      </form>

      <div className="mt-6 card p-4 bg-brand-50/60 border-brand-100">
        <p className="text-xs font-semibold text-brand-800 mb-2">Demo accounts (password: password123)</p>
        <div className="flex flex-wrap gap-2">
          {DEMO_ACCOUNTS.map((a) => (
            <button key={a.email} onClick={() => setEmail(a.email)} type="button" className="text-xs bg-white border border-brand-200 rounded-lg px-2.5 py-1.5 text-brand-700 hover:bg-brand-100">
              {a.label}: {a.email}
            </button>
          ))}
        </div>
      </div>

      <p className="text-center text-sm text-slate-500 mt-6">
        New here?{" "}
        <Link href="/register" className="text-brand-700 font-semibold">
          Create an account
        </Link>
      </p>
    </div>
  );
}
