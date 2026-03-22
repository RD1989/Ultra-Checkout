"use client";

import { DollarSign, TrendingUp, Users, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function DashboardMetrics() {
  const stats = [
    { label: "Faturamento Total", value: "R$ 45.230,00", icon: <DollarSign className="w-5 h-5 text-green-500" />, trend: "+12.5%", color: "bg-green-50" },
    { label: "Ticket Médio (AOV)", value: "R$ 287,50", icon: <TrendingUp className="w-5 h-5 text-blue-500" />, trend: "+3.2%", color: "bg-blue-50" },
    { label: "Taxa de Conversão", value: "3.8%", icon: <Target className="w-5 h-5 text-purple-500" />, trend: "+0.8%", color: "bg-purple-50" },
    { label: "Leads Pendentes", value: "142", icon: <Users className="w-5 h-5 text-orange-500" />, trend: "-2.1%", color: "bg-orange-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-inter">
      {stats.map((stat, i) => (
        <Card key={i} className="border-none shadow-xl border-slate-100/50 overflow-hidden group hover:scale-[1.02] transition-transform">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center transition-all group-hover:rotate-12`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-full ${stat.trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                {stat.trend}
              </span >
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
