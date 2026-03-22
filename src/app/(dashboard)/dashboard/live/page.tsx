"use client";

import { useEffect, useState } from "react";
import { Zap, ShoppingBag, TrendingUp, Users, ArrowUpRight, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileLiveView() {
  const [sales, setSales] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({ today: 4560, orders: 12, conversion: 68 });

  // Simulação de Polling Real-time
  useEffect(() => {
    const names = ["Marcos", "Clara", "Daniel", "Sofia", "Vitor"];
    const interval = setInterval(() => {
      const newSale = {
        id: Math.random().toString(36).substr(2, 9),
        name: names[Math.floor(Math.random() * names.length)],
        amount: (Math.random() * 500 + 47).toFixed(2),
        time: "Agora mesmo"
      };
      setSales(prev => [newSale, ...prev.slice(0, 4)]);
      // Tocar som de "ching" opcional
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 font-inter pb-20">
      <header className="flex items-center justify-between mb-8 pt-4">
        <div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tempo Real</p>
           <h1 className="text-2xl font-black tracking-tighter">Ultra Live</h1>
        </div>
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center animate-pulse">
           <Activity className="w-5 h-5 text-white" />
        </div>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
           <p className="text-[10px] font-bold text-slate-400">Vendas hoje</p>
           <p className="text-xl font-black">R$ {metrics.today}</p>
        </div>
        <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
           <p className="text-[10px] font-bold text-slate-400">Pedidos</p>
           <p className="text-xl font-black">{metrics.orders}</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-sm font-black uppercase text-slate-500 tracking-widest pl-1">Atividade Recente</h2>
        <AnimatePresence mode="popLayout">
          {sales.map((sale) => (
            <motion.div 
              key={sale.id}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-white/10 p-5 rounded-[32px] flex items-center justify-between border border-white/5 backdrop-blur-xl"
            >
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-primary" />
                 </div>
                 <div>
                    <p className="text-sm font-bold">{sale.name}</p>
                    <p className="text-[10px] text-slate-400">{sale.time}</p>
                 </div>
              </div>
              <p className="font-black text-primary">+ R$ {sale.amount}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-white/10 p-4 grid grid-cols-3">
         <button className="flex flex-col items-center gap-1 text-primary">
            <TrendingUp className="w-6 h-6" />
            <span className="text-[8px] font-bold uppercase">Métricas</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors">
            <Zap className="w-6 h-6" />
            <span className="text-[8px] font-bold uppercase">Alertas</span>
         </button>
         <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors">
            <Users className="w-6 h-6" />
            <span className="text-[8px] font-bold uppercase">Leads</span>
         </button>
      </div>
    </div>
  );
}
