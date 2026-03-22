"use client";

import { Check, Plus } from "lucide-react";

export function OrderBump({ product, onToggle, selected }: any) {
  return (
    <div 
      onClick={onToggle}
      className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all ${selected ? "border-primary bg-primary/5 shadow-lg" : "border-dashed border-slate-200 hover:border-slate-300"}`}
    >
      <div className="flex items-center gap-4">
        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selected ? "bg-primary border-primary text-white" : "border-slate-200"}`}>
          {selected && <Check className="w-4 h-4" />}
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 flex items-center gap-1">
            <Plus className="w-3 h-3" /> OFERTA ESPECIAL
          </p>
          <h4 className="text-sm font-black text-slate-800 leading-tight">{product.name}</h4>
          <p className="text-xs text-slate-400 mt-1">Adicione ao seu pedido por apenas <span className="text-slate-900 font-bold">R$ {Number(product.price).toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
}
