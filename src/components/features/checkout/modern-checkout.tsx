"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, Truck, Zap, ShoppingCart, Timer, Star, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { OrderSummary } from "@/components/features/checkout/order-summary";
import { CheckoutForm } from "@/components/features/checkout/checkout-form";
import { UpsellOffer } from "@/components/features/checkout/upsell-offer";

function SocialProof() {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const names = ["Ricardo M.", "Ana Paula", "Julia S.", "Carlos V.", "Beatriz L."];

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(true);
      setCurrent(prev => (prev + 1) % names.length);
      setTimeout(() => setVisible(false), 4000);
    }, 12000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-50 bg-white p-3 md:p-4 rounded-2xl shadow-2xl border border-slate-100 flex items-center gap-4 max-w-[calc(100vw-32px)] md:max-w-xs"
        >
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shrink-0">
             <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-800 leading-tight">{names[current]} acabou de comprar!</p>
            <p className="text-[10px] text-slate-400 font-medium">Há menos de 1 minuto em São Paulo</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ModernCheckout({ product, tenant }: any) {
  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(900); // 15 min

  useEffect(() => {
    const it = setInterval(() => setTimer(t => t > 0 ? t - 1 : 0), 1000);
    return () => clearInterval(it);
  }, []);

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row font-inter">
      <SocialProof />
      
      {/* Esquerda: Persuasão & Review */}
      <div className="lg:w-1/2 p-6 md:p-12 lg:p-20 flex flex-col justify-center space-y-8 lg:space-y-12">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest">
            <Zap className="w-4 h-4" /> Oferta Pendente: Finalize em {formatTime(timer)}
          </div>
          <h1 className="text-3xl lg:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
            Você está a um passo da sua <span className="text-primary italic underline decoration-wavy decoration-blue-200">transformação.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-md">
            Junte-se a mais de 10.000 alunos que já mudaram de nível com o {product.name}.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Pagamento Seguro</p>
              <p className="text-xs text-slate-400">Ambiente criptografado 256-bit.</p>
            </div>
          </div>
          <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-start gap-4 text-left">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
              <Star className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Acesso Imediato</p>
              <p className="text-xs text-slate-400">Receba seus dados agora mesmo.</p>
            </div>
          </div>
        </div>

        {/* Prova Social Rápida */}
        <div className="p-8 bg-slate-900 text-white rounded-[40px] relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 border-4 border-slate-900 rounded-full bg-slate-700" />
              ))}
            </div>
            <p className="text-sm font-medium">
              <span className="text-green-400 font-bold">14 pessoas</span> compraram este item nas últimas 2 horas.
            </p>
          </div>
          <CheckCircle2 className="absolute -bottom-4 -right-4 w-32 h-32 text-white/5" />
        </div>
      </div>

      {/* Direita: Checkout Real */}
      <div className="lg:w-1/2 p-3 md:p-8 lg:p-12 flex items-center justify-center">
        <div className="w-full max-w-xl space-y-6">
          <OrderSummary product={product} />
          <CheckoutForm product={product} tenant={tenant} />
          
          <div className="flex items-center justify-center gap-6 opacity-30 grayscale pt-4">
             <img src="/selos-pagamento.png" alt="Seguro" className="h-6" />
          </div>
        </div>
      </div>

    </div>
  );
}
