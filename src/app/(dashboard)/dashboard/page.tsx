"use client";

import { DashboardMetrics } from "@/components/features/dashboard/dashboard-metrics";
import { AbandonmentTable } from "@/components/features/dashboard/abandonment-table";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, ShoppingBag, Users, Settings, Bell, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeBuilder } from "@/components/features/dashboard/theme-builder";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-50/50 font-inter">
      
      {/* Sidebar Simulado */}
      <aside className="hidden lg:flex w-64 bg-slate-900 flex-col p-6 text-white space-y-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">U</span>
          </div>
          <span className="text-xl font-black tracking-tighter">ULTRA</span>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", active: true },
            { icon: <ShoppingBag className="w-5 h-5" />, label: "Produtos", active: false },
            { icon: <Users className="w-5 h-5" />, label: "Clientes", active: false },
            { icon: <Settings className="w-5 h-5" />, label: "Configurações", active: false },
          ].map((item, i) => (
            <button 
              key={i} 
              className={`flex items-center gap-3 w-full p-3 rounded-lg text-sm font-medium transition-colors ${item.active ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <header className="h-20 bg-white border-b px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-black text-slate-800 tracking-tight">Painel Operacional</h2>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-2">
              <Bell className="w-4 h-4" />
            </Button>
            <Button className="gap-2 font-black shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4" /> Novo Produto
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-10 max-w-7xl mx-auto">
          
          <Tabs defaultValue="overview" className="space-y-10">
            <TabsList className="bg-slate-100 p-1 rounded-2xl h-14 w-fit">
              <TabsTrigger value="overview" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:shadow-lg">Métricas</TabsTrigger>
              <TabsTrigger value="branding" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:shadow-lg">Design</TabsTrigger>
              <TabsTrigger value="subscriptions" className="rounded-xl px-8 font-black text-xs uppercase tracking-widest h-full data-[state=active]:bg-white data-[state=active]:shadow-lg">Assinaturas</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-10 animate-in fade-in duration-500">
              <DashboardMetrics />
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <AbandonmentTable />
                </div>
                <div className="space-y-6">
                   <Card className="border-none shadow-xl bg-primary text-white p-8 space-y-4">
                     <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Conversão de Hoje</p>
                     <p className="text-4xl font-black tracking-tighter">R$ 4.560,00</p>
                     <div className="h-1 w-full bg-white/20 rounded-full overflow-hidden">
                       <div className="w-[70%] h-full bg-white" />
                     </div>
                     <p className="text-xs font-bold">70% da meta diária atingida</p>
                   </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="branding" className="animate-in fade-in duration-500">
              <ThemeBuilder />
            </TabsContent>

            <TabsContent value="subscriptions" className="animate-in fade-in duration-500">
               <div className="aspect-video bg-slate-50 rounded-[40px] border-4 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 gap-4">
                 <CreditCard className="w-12 h-12" />
                 <p className="font-black text-xl text-slate-500">Módulo de Recorrência Configurado</p>
                 <Button variant="secondary" className="font-black">CRIAR MEU PRIMEIRO PLANO</Button>
               </div>
            </TabsContent>
          </Tabs>

        </div>
      </main>
    </div>
  );
}
