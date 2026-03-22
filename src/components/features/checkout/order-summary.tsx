export function OrderSummary({ product }: any) {
  return (
    <div className="bg-white p-5 md:p-8 rounded-[28px] md:rounded-[32px] shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
          {product.imageUrl && <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-black text-slate-900 leading-tight">{product.name}</h3>
          <p className="text-xs text-slate-400">Acesso Vitalício</p>
        </div>
        <div className="text-right font-black text-slate-900">
          R$ {Number(product.price).toFixed(2)}
        </div>
      </div>
      
      <div className="h-[1px] bg-slate-50" />
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Hoje:</span>
        <span className="text-2xl font-black text-primary">R$ {Number(product.price).toFixed(2)}</span>
      </div>
    </div>
  );
}
