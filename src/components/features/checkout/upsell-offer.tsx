"use client";

import { useState } from "react";
import { Zap, ChevronRight, Star, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export function UpsellOffer({ product, onAccept, onDecline }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[40px] shadow-2xl border-4 border-primary/20 overflow-hidden max-w-2xl w-full"
    >
      <div className="bg-primary p-4 text-center text-white text-[10px] font-black uppercase tracking-[0.2em]">
        🔥 ESPERE! NÃO FECHE ESTA PÁGINA AINDA
      </div>
      
      <div className="p-8 lg:p-12 space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-black text-slate-900 leading-tight">
            Turbine seu resultado com o <span className="text-primary italic underline decoration-blue-200">{product.name}</span>
          </h2>
          <p className="text-slate-500 font-medium">
            Adicione este item exclusivo ao seu pedido agora com **50% de desconto** único e imediato.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
           <div className="w-32 h-32 bg-slate-200 rounded-2xl overflow-hidden shadow-inner">
             {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
           </div>
           <div className="flex-1 text-left space-y-2">
             <div className="flex gap-1">
               {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />)}
             </div>
             <p className="text-lg font-black text-slate-800 leading-tight">{product.name}</p>
             <div className="flex items-center gap-3">
               <span className="text-slate-400 line-through text-xs italic">De: R$ 197,00</span>
               <span className="text-xl font-black text-primary">Por: R$ {Number(product.price).toFixed(2)}</span>
             </div>
           </div>
        </div>

        <div className="space-y-4">
          <button 
            onClick={onAccept}
            className="w-full h-20 bg-primary hover:bg-primary-dark text-white rounded-[24px] font-black text-xl shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 group transition-all"
          >
            SIM! ADICIONAR AO MEU PEDIDO <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </button>
          
          <button 
            onClick={onDecline}
            className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
          >
            Não obrigado, quero pagar o preço cheio depois
          </button>
        </div>

        <div className="pt-4 flex items-center justify-center gap-4 text-[10px] font-black text-slate-400 uppercase">
          <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Compra Segura</div>
          <div className="flex items-center gap-1"><Zap className="w-3 h-3" /> Acesso Imediato</div>
        </div>
      </div>
    </motion.div>
  );
}
