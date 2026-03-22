"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { CreditCard, QrCode, Lock, ChevronRight, Loader2, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { createOrderAction } from "@/actions/orders-action";
import { captureLeadAction } from "@/actions/leads-action";
import { trackPixelEvent } from "./meta-pixel";
import { OrderBump } from "./order-bump";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart } from "lucide-react";

const schema = z.object({
  email: z.string().email("Email inválido"),
  name: z.string().min(3, "Nome muito curto"),
  document: z.string().min(11, "CPF inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  zipcode: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Rua inválida"),
  number: z.string().min(1, "Número inválido"),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  paymentMethod: z.enum(["PIX", "CREDIT_CARD"]),
});

export function CheckoutForm({ product, tenant }: any) {
  const [loading, setLoading] = useState(false);
  const [addressLoading, setAddressLoading] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "PIX" } as any
  });

  const paymentMethod = watch("paymentMethod");
  const zipcode = watch("zipcode");

  const handleZipCode = async () => {
    if (zipcode?.length === 8) {
      setAddressLoading(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${zipcode}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setValue("street", data.logradouro);
          setValue("neighborhood", data.bairro);
          setValue("city", data.localidade);
          setValue("state", data.uf);
        }
      } catch (err) {
        console.error("CEP error");
      }
      setAddressLoading(false);
    }
  };

  const [bumpSelected, setBumpSelected] = useState(false);
  const [showStickyBump, setShowStickyBump] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !bumpSelected) setShowStickyBump(true);
      else setShowStickyBump(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [bumpSelected]);

  const handleLeadCapture = async () => {
    const email = watch("email");
    const name = watch("name");
    const phone = watch("phone");
    if (email && email.includes("@")) {
      await captureLeadAction({ email, name, phone, tenantId: tenant.id, productId: product.id });
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    trackPixelEvent("InitiateCheckout", { value: Number(product.price), currency: "BRL" });
    
    const res = await createOrderAction({ ...data, productId: product.id, tenantId: tenant.id });
    
    if (res.success) {
      trackPixelEvent("Purchase", { value: Number(product.price), currency: "BRL" });
      window.location.href = `/success?orderId=${res.orderId}`;
    } else {
      // SMART RETRY: Se for cartão, sugere PIX imediatamente
      if (paymentMethod === "CREDIT_CARD") {
        setLoading(false);
        setValue("paymentMethod", "PIX");
        // Scroll suave para cima para mostrar o erro/mudança
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return; 
      }
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      
      <div className="bg-white p-5 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-slate-100 space-y-6">
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Informações de Contato</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input {...register("email")} onBlur={handleLeadCapture} placeholder="Seu melhor e-mail" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
            <input {...register("name")} onBlur={handleLeadCapture} placeholder="Nome completo" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input {...register("document")} placeholder="CPF" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
            <input {...register("phone")} onBlur={handleLeadCapture} placeholder="WhatsApp" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Endereço de Entrega</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <input {...register("zipcode")} onBlur={handleZipCode} placeholder="CEP" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
            <input {...register("street")} placeholder="Rua / Logradouro" className="w-full md:col-span-2 h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <input {...register("number")} placeholder="Nº" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
            <input {...register("neighborhood")} placeholder="Bairro" className="w-full md:col-span-2 h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Forma de Pagamento</label>
          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => setValue("paymentMethod", "PIX")}
              className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "PIX" ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
            >
              <QrCode className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase">PIX</span>
            </button>
            <button 
              type="button"
              onClick={() => setValue("paymentMethod", "CREDIT_CARD")}
              className={`h-20 rounded-2xl border-2 flex flex-col items-center justify-center gap-1 transition-all ${paymentMethod === "CREDIT_CARD" ? "border-primary bg-primary/5 text-primary" : "border-slate-100 text-slate-400 hover:border-slate-200"}`}
            >
              <CreditCard className="w-6 h-6" />
              <span className="text-[10px] font-black uppercase">CARTÃO</span>
            </button>
          </div>
        </div>

        {paymentMethod === "CREDIT_CARD" && (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
             <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dados do Cartão</label>
             <input placeholder="Número do Cartão" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
             <div className="grid grid-cols-2 gap-4">
               <input placeholder="MM/AA" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
               <input placeholder="CVC" className="w-full h-14 px-6 rounded-2xl bg-slate-50 border-none focus:ring-2 ring-primary transition-all text-sm font-medium" />
             </div>
          </div>
        )}

        <button 
          disabled={loading}
          type="submit" 
          className="w-full h-16 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-lg shadow-xl shadow-primary/20 flex items-center justify-center gap-3 group transition-all"
        >
          {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
            <>FINALIZAR AGORA <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
          )}
        </button>
      </div>

      {product.orderBumps?.[0] && (
        <OrderBump 
          product={product.orderBumps[0].bumpProduct} 
          selected={bumpSelected} 
          onToggle={() => setBumpSelected(!bumpSelected)} 
        />
      )}

      <AnimatePresence>
        {showStickyBump && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 lg:hidden flex items-center justify-between"
          >
            <div className="flex items-center gap-3 pr-4">
               <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                 <ShoppingCart className="w-5 h-5" />
               </div>
               <div>
                  <p className="text-[10px] font-black uppercase text-primary">Oferta Especial</p>
                  <p className="text-xs font-bold text-slate-800">Adicionar {product.orderBumps[0].bumpProduct.name}?</p>
               </div>
            </div>
            <button 
              onClick={() => { setBumpSelected(true); setShowStickyBump(false); }}
              className="px-6 h-10 bg-primary text-white rounded-xl text-xs font-black shadow-lg shadow-primary/20"
            >
              SIM, ADICIONAR
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-center text-[10px] font-bold text-slate-400 flex items-center justify-center gap-2">
        <Lock className="w-3 h-3" /> PAGAMENTO 100% PROCESSADO PELA EFÍ PAY
      </p>
    </form>
  );
}
