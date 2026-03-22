"use client";

import { CheckCircle2, ShoppingBag, ArrowRight, Zap, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function SuccessPage({ orderId }: { orderId: string }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6 font-inter">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[150%] bg-gradient-to-br from-green-500/5 via-transparent to-primary/10 blur-[120px]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-[48px] shadow-2xl border border-slate-100 p-12 lg:p-16 text-center space-y-10 relative z-10"
      >
        <div className="relative inline-block">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-24 h-24 bg-green-500 rounded-[32px] flex items-center justify-center shadow-xl shadow-green-500/20"
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </motion.div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-4 border-2 border-dashed border-green-500/20 rounded-[40px]"
          />
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter">
            Pagamento Confirmado!
          </h1>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            O seu acesso ao **Masterclass Ultra SaaS** foi enviado agora mesmo para o seu e-mail.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 text-left">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-slate-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pedido ID</p>
                <p className="text-xs font-bold text-slate-800">#{orderId}</p>
              </div>
           </div>
           <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center gap-4 text-left">
              <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                <p className="text-xs font-bold text-slate-800">Acesso Vitalício</p>
              </div>
           </div>
        </div>

        <div className="pt-4 space-y-4">
          <Button className="w-full h-16 rounded-2xl font-black text-lg gap-3 group">
            ACESSAR ÁREA DE MEMBROS <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-primary" /> Ativação Instantânea</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Confirmado pela Efí</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
