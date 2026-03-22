"use client";

import { useState } from "react";
import { Palette, Check, Moon, Sun, Sparkles, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ThemeBuilder() {
  const [selectedTheme, setSelectedTheme] = useState("stripe");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-inter animate-in fade-in duration-700">
      
      <div className="lg:col-span-4 space-y-6">
        <Card className="border-none shadow-2xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Palette className="w-4 h-4 text-primary" /> CONSTRUTOR DE MARCA
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            <div className="space-y-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Temas Elite</div>
            <div className="space-y-3">
              {['Stripe Luxe', 'Hotmart Flow', 'Kiwify Dark'].map((t, i) => (
                <button key={i} className="w-full p-4 rounded-2xl border-2 border-slate-100 flex items-center justify-between hover:border-primary/50 transition-all">
                   <span className="text-sm font-black text-slate-800">{t}</span>
                   <div className="w-4 h-4 rounded-full bg-primary" />
                </button>
              ))}
            </div>
            <Button className="w-full h-14 rounded-2xl font-black shadow-lg shadow-primary/20">SALVAR IDENTIDADE</Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-8 bg-slate-100 rounded-[48px] p-12 flex items-center justify-center border-4 border-white shadow-inner min-h-[600px] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-gradient-to-br from-primary/5 via-transparent to-blue-500/10 blur-[120px]" />
        
        <div className="w-full max-w-sm bg-white rounded-[40px] shadow-2xl overflow-hidden border border-slate-200 relative z-10 scale-90 md:scale-100 transition-transform">
          <div className="p-6 border-b flex items-center justify-between bg-slate-50/50">
            <div className="w-6 h-6 bg-slate-900 rounded-lg" />
            <Smartphone className="w-4 h-4 text-slate-300" />
          </div>
          <div className="p-10 space-y-8">
            <div className="space-y-3">
              <div className="h-3 w-20 bg-slate-100 rounded-full" />
              <div className="h-8 w-48 bg-slate-100 rounded-2xl" />
            </div>
            <div className="space-y-4">
              <div className="h-14 w-full bg-slate-50 border rounded-2xl" />
              <div className="h-14 w-full bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xs gap-2">
                PAGAR AGORA <Check className="w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
