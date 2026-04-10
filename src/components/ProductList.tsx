"use client";
import { useState, useEffect } from "react";
import OrderModal from "./OrderModel";

export default function ProductList({ products }: { products: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !products.length) return null;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <section id="menu" className="max-w-7xl mx-auto px-4 md:px-10 py-20">
      <div className="mb-12 text-left">
        <span className="text-[#FF8C00] font-black tracking-widest uppercase text-[10px]">Katalog</span>
        <h2 className="text-3xl font-black text-[#4B2C20]">Semua <span className="text-[#FF8C00]">Menu</span></h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {currentItems.map((item) => (
          <div 
            key={item.id} 
            className="flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 p-4 bg-white rounded-4xl border border-gray-100 hover:shadow-xl transition-all group"
          >
            <div className="w-full md:w-28 aspect-square md:h-28 shrink-0 rounded-2xl overflow-hidden bg-gray-50">
              <img
                src={item.gambar?.trim()}
                alt={item.nama}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/products/pizzaa.webp";
                }}
              />
            </div>

            {/* Konten */}
            <div className="flex flex-col justify-between flex-1 w-full min-w-0 text-left">
              <div>
                <h4 className="font-bold text-[#4B2C20] text-sm md:text-base leading-tight line-clamp-1">
                  {item.nama}
                </h4>
                <p className="text-gray-400 text-[10px] md:text-xs mt-1 line-clamp-1 md:line-clamp-2">
                  {item.deskripsi}
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <span className="font-black text-[#FF8C00] text-xs md:text-sm">
                  Rp {item.harga.toLocaleString('id-ID')}
                </span>
                
                <button 
                  onClick={() => setSelectedProduct(item)}
                  className="w-full bg-[#4B2C20] text-white text-[10px] py-2 rounded-xl font-bold hover:bg-[#FF8C00] transition-all active:scale-95"
                >
                  Pesan
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-12 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
            className="p-3 rounded-xl bg-gray-50 text-[#4B2C20] disabled:opacity-30"
          >
            ←
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-xl font-black ${
                currentPage === i + 1 ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-100" : "bg-gray-50 text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
            className="p-3 rounded-xl bg-gray-50 text-[#4B2C20] disabled:opacity-30"
          >
            →
          </button>
        </div>
      )}

      {selectedProduct && (
        <OrderModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  );
}