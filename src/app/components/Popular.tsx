"use client";
import { useState, useEffect } from "react";
import { Star, Plus } from "lucide-react";
import OrderModal from "./OrderModel";

export default function Popular({ products, onAddToCart }: { products: any[], onAddToCart: (item: any) => void }) {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !products || !products.length) return null;

  const popularItems = products.slice(0, 3);

  return (
    <section id="populer" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Popular Menu</h2>
          <p className="text-xl text-muted-foreground">Our most loved dishes by customers</p>
        </div>

        {/* --- CARA BARU: NATIVE SCROLL SNAP --- */}
        <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-10 px-2">
          {popularItems.map((item) => (
            <div 
              key={item.id} 
              className="min-w-[85%] sm:min-w-[calc(33.333%-1rem)] snap-center first:ml-2 last:mr-2"
            >
              <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group h-full relative">
                
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/pizzaa.webp"; }}
                  />
                  <div className="absolute top-3 left-3 bg-secondary text-foreground rounded-lg px-3 py-1 text-sm font-semibold">
                    {item.kategori}
                  </div>
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col h-[calc(100%-12rem)]">
                  <h3 className="font-bold text-lg text-foreground mb-1">{item.nama}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                    {item.deskripsi}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary">
                      Rp.{item.harga.toLocaleString('id-ID')}
                    </span>
                    <button
                      onClick={() => onAddToCart(item)}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-[#ff5722] transition-colors"
                    >
                      <div className="flex items-center gap-1">
                        <Plus className="w-5 h-5" /> <p>Beli</p>
                      </div>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedProduct && (
        <OrderModal 
          onClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
    </section>
  );
}