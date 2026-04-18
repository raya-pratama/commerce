"use client";

import { useState } from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { MenuItem } from '../types';

interface AddToCartModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: MenuItem | null;
  onConfirm: (quantity: number) => void;
}

export function AddToCartModal({ isOpen, onClose, item, onConfirm }: AddToCartModalProps) {
  const [quantity, setQuantity] = useState(1);

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
    onClose();
  };

  if (!item) return null;

  const subtotal = item.harga * quantity;

  const formatharga = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              // className="bg-white rounded-3xl shadow-2xl max-w-md w-full pointer-events-auto"
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[95vh] overflow-y-auto pointer-events-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Header */}
              <div className="relative">
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-colors"
                >
                  <X className="w-5 h-5 text-foreground" />
                </button>
                
                {/* Food Image */}
                <div className="relative h-64 rounded-t-3xl overflow-hidden">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-linear-to-trom-black/50 to-transparent"></div>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Item Details */}
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{item.nama}</h3>
                  <p className="text-muted-foreground">{item.deskripsi}</p>
                  <div className="mt-3 inline-block bg-primary/10 text-primary px-4 py-2 rounded-lg">
                    <span className="text-xl font-bold">{formatharga(item.harga)}</span>
                    <span className="text-sm"> / item</span>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-3">
                    Jumlah
                  </label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 rounded-xl bg-muted hover:bg-primary hover:text-white disabled:opacity-40 disabled:hover:bg-muted disabled:hover:text-foreground transition-colors flex items-center justify-center"
                    >
                      <Minus className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1 text-center">
                      <div className="text-3xl font-bold text-primary">{quantity}</div>
                    </div>
                    
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-xl bg-primary hover:bg-[#ff5722] text-white transition-colors flex items-center justify-center"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Subtotal */}
                <div className="bg-linear-to-br from-[#FFF8E7] to-white rounded-2xl p-4 border-2 border-secondary/30">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground font-semibold">Subtotal</span>
                    <span className="text-2xl font-bold text-primary">{formatharga(subtotal)}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleClose}
                    className="py-3 px-4 bg-white border-2 border-border hover:border-primary text-foreground rounded-xl transition-colors font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="py-3 px-4 bg-primary hover:bg-[#ff5722] text-white rounded-xl transition-all font-semibold shadow-lg shadow-primary/30 transform hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Tambah ke Keranjang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}