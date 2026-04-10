"use client";
import { useState, useEffect } from "react";
import OrderModal from "./OrderModel"; 

export default function Popular({ products }: { products: any[] }) {
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !products.length) return null;

  const popularItems = products.slice(0, 3);

  return (
    <section id="popular" className="w-full py-12 bg-white">
      {/* Container utama */}
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header Section */}
        <div className="mb-10 text-left">
          <span className="text-[#FF8C00] font-black tracking-widest uppercase text-[10px]">
            Paling Dicari
          </span>
          <h2 className="text-3xl font-black text-[#4B2C20]">
            Popular <span className="text-[#FF8C00]">Food</span>
          </h2>
        </div>

        {/* Grid Container */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-6 scrollbar-hide snap-x snap-mandatory justify-items-center">
          {popularItems.map((item, index) => (
            <div 
              key={item.id} 
              className="min-w-70 w-full md:max-w-[320px] mx-auto snap-center bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-start hover:shadow-md transition-shadow"
            >
              <div className="relative w-50 h-50 rounded-4xl overflow-hidden bg-gray-50 mb-6 self-center border border-gray-50">
                <div className="absolute top-3 left-3 bg-[#4B2C20] text-white w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black z-10 shadow-lg">
                  #{index + 1}
                </div>
                <img 
                  src={item.gambar?.trim()} 
                  alt={item.nama} 
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "/products/pizzaa.webp"; }} 
                />
              </div>
              
              <div className="w-full text-left">
                <h3 className="text-xl font-bold text-[#4B2C20] capitalize mb-1">{item.nama}</h3>
                
                <p className="text-gray-400 text-[11px] font-medium leading-relaxed line-clamp-2 h-8 mb-4">
                  {item.deskripsi}
                </p>
                
                <div className="mb-6">
                  <span className="text-[10px] text-gray-300 font-bold block uppercase tracking-tighter">HARGA</span>
                  <span className="text-2xl font-black text-[#FF8C00]">
                    Rp {item.harga.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedProduct(item)}
                className="w-full bg-[#4B2C20] text-white py-4 rounded-2xl font-bold text-sm hover:bg-[#FF8C00] transition-all active:scale-95 shadow-lg shadow-gray-100"
              >
                Pesan Sekarang
              </button>
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <OrderModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
        />
      )}
    </section>
  );
}