"use client";

import { Shield, Clock, Info } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export function AuditLogTable({ logs }: any) {
  return (
    <Card className="border-none shadow-xl">
      <CardHeader className="border-b bg-slate-50/50">
        <CardTitle className="flex items-center gap-2 text-sm font-black">
          <Shield className="w-4 h-4 text-slate-900" /> REGISTRO DE SEGURANÇA (AUDIT)
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y">
          {(logs || []).map((log: any) => (
            <div key={log.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${log.action.includes('REFUND') ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800 uppercase tracking-tighter">{log.action}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Recurso: {log.resource}</p>
                </div>
              </div>
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-900 italic">Admin</p>
                 <p className="text-[10px] text-slate-400">12:45 - 22/03</p>
              </div>
            </div>
          ))}
          {!logs?.length && (
            <div className="p-12 text-center text-slate-400 text-xs italic">Sem registros recentes.</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
