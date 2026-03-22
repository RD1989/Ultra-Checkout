"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Shield, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      callbackUrl: "/dashboard"
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 font-inter">
      <div className="w-full max-w-md bg-white rounded-[40px] p-10 lg:p-14 shadow-2xl space-y-8 animate-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
             <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900 italic uppercase">Log-in Admin</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="email" type="email" placeholder="E-mail" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-sm font-bold" />
          <input name="password" type="password" placeholder="Senha" required className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-2 border-slate-100 focus:border-primary focus:ring-0 transition-all text-sm font-bold" />
          
          <button 
            disabled={loading}
            className="w-full h-16 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "ACESSAR CONSOLE"}
          </button>
        </form>
      </div>
    </div>
  );
}
