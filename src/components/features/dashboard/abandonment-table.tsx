"use client";

import { MessageCircle, Clock, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const MOCK_LEADS = [
  { id: 1, name: "Carlos Oliveira", email: "carlos@gmail.com", phone: "11999999999", product: "Masterclass Ultra SaaS", time: "Há 12 min" },
  { id: 2, name: "Ana Beatriz", email: "ana.b@hotmail.com", phone: "21988888888", product: "Pack de Templates UI", time: "Há 45 min" },
  { id: 3, name: "Marcos Paulo", email: "marcos.p@uol.com.br", phone: "31977777777", product: "Masterclass Ultra SaaS", time: "Há 2 horas" },
];

export function AbandonmentTable() {
  return (
    <Card className="border-none shadow-xl border-slate-100/50 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b">
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" /> CARRINHOS ABANDONADOS
        </CardTitle>
        <span className="text-[10px] font-black bg-primary text-white px-3 py-1 rounded-full">3 NOVOS AGORA</span>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/30 text-[10px] font-black uppercase tracking-widest text-slate-400 border-b">
              <tr>
                <th className="px-6 py-4">Cliente / Contato</th>
                <th className="px-6 py-4">Produto Interagido</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_LEADS.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-bold text-slate-800">{lead.name}</p>
                        <p className="text-[10px] font-medium text-slate-400">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs font-bold text-slate-600">{lead.product}</p>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {lead.time}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-600 uppercase">
                      Pendente
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="outline" size="sm" className="gap-2 h-9 rounded-xl border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 font-black">
                      <MessageCircle className="w-4 h-4" /> RECUPERAR
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
