"use client";

import { QrCode, Copy, Check, Info } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function PixDisplay({ qrCodeBase64, pixCopiaECola }: any) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCopiaECola);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] shadow-2xl border border-slate-100 space-y-8 text-center animate-in zoom-in-95 duration-500">
      <div className="space-y-2">
        <h2 className="text-2xl font-black text-slate-900">Aguardando Pagamento</h2>
        <p className="text-sm text-slate-400">Escaneie o QR Code abaixo para finalizar sua compra.</p>
      </div>

      <div className="relative group p-4 bg-slate-50 rounded-[32px] w-fit mx-auto">
        <img src={qrCodeBase64} alt="QR Code Pix" className="w-48 h-48 rounded-xl shadow-inner mix-blend-multiply" />
        <div className="absolute inset-0 bg-primary/5 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="space-y-4">
        <div className="p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between gap-4">
          <div className="truncate text-[10px] font-mono font-medium text-slate-400">
            {pixCopiaECola}
          </div>
          <Button variant="secondary" onClick={handleCopy} className="rounded-xl h-10 px-4 gap-2">
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            {copied ? "COPIADO" : "COPIAR"}
          </Button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-blue-500 bg-blue-50 py-3 rounded-xl px-4">
          <Info className="w-4 h-4" /> O ACESSO SERÁ ENVIADO IMEDIATAMENTE APÓS A CONFIRMAÇÃO
        </div>
      </div>
    </div>
  );
}
