"use client";

import { useState, useEffect } from "react";
import { Star, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MenuItem } from '../types';

interface MenuExplorerProps {
  onAddToCart: (item: MenuItem) => void;
}

export default function ProductList({ products, onAddToCart }: { products: any[] } & MenuExplorerProps) {
  // 1. SEMUA HOOK DI ATAS
  const [mounted, setMounted] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const itemsPerPage = 6;

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fungsi handle klik beli
  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // 2. RETURN AWAL SETELAH HOOKS
  if (!mounted || !products || !products.length) return null;

  // 3. LOGIKA PAGINATION
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const currentItems = products.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // Fungsi pindah halaman
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Auto scroll ke atas menu saat ganti halaman (biar user gak bingung)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="menu" className="py-20 bg-muted">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Menu Explorer</h2>
          <p className="text-xl text-muted-foreground">Our full collection of delicious dishes</p>
        </div>

        {/* Menu Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group flex flex-col"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 bg-secondary text-foreground rounded-lg px-3 py-1 text-sm font-semibold">
                  {item.kategori}
                </div>
                <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                  <Star className="w-4 h-4 fill-secondary text-secondary" />
                  <span className="text-sm font-semibold">{item.rating}</span>
                </div>
              </div>

              <div className="p-5 flex flex-col grow">
                <h3 className="font-bold text-lg text-foreground mb-1">{item.nama}</h3>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{item.deskripsi}</p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-bold text-primary">
                    Rp.{item.harga.toLocaleString('id-ID')}
                  </span>
                  <button
                    onClick={() => onAddToCart(item)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#ff5722] transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    Beli
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* --- UI PAGINATION --- */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            {/* Tombol Prev */}
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Angka Halaman */}
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                      currentPage === pageNumber
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white border border-border text-foreground hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            {/* Tombol Next */}
            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-border bg-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* RENDER MODAL */}
      {/* {isModalOpen && selectedProduct && (
        <OrderConfirmationModal 
          onClose={() => setIsModalOpen(false)}  
          product={selectedProduct} 
        />
      )} */}
    </section>
  );
}