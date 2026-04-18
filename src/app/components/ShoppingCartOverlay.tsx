import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { CartItem } from '../types';

interface ShoppingCartOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (id: number) => void;
  onUpdateQuantity: (id: number, newQuantity: number) => void;
  onCheckout: () => void;
}

export function ShoppingCartOverlay({ isOpen, onClose, items, onRemoveItem, onUpdateQuantity,onCheckout }: ShoppingCartOverlayProps) {
  const formatharga = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga * 1000);
  };

  const total = items.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    onCheckout();
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
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Overlay Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full sm:w-120 bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-primary to-[#ff5722] text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-xl">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Keranjang Belanja</h2>
                  <p className="text-sm text-white/90">{totalItems} item{totalItems !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="bg-muted rounded-full p-8 mb-4">
                    <ShoppingBag className="w-16 h-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Keranjang Kosong</h3>
                  <p className="text-muted-foreground">Belum ada item yang ditambahkan</p>
                  <button
                    onClick={onClose}
                    className="mt-6 bg-primary hover:bg-[#ff5722] text-white px-6 py-3 rounded-xl transition-colors"
                  >
                    Lihat Menu
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="bg-white border-2 border-border rounded-2xl p-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h4 className="font-bold text-foreground mb-1">{item.nama}</h4>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                            <span>{formatharga(item.harga)} × {item.quantity}</span>
                          </div>
                          <div className="text-lg font-bold text-primary">
                            {formatharga(item.harga * item.quantity)}
                          </div>
                        </div>
                        
                        <button
                          onClick={() => {
                          if (item.quantity > 1) {
                              // Jika masih lebih dari 1, kita panggil fungsi kurangi jumlah
                              // Kamu perlu memastikan fungsi onUpdateQuantity ada di props
                              onUpdateQuantity(item.id, item.quantity - 1);
                            } else {
                              // Jika sisa 1, baru benar-benar hapus dari keranjang
                              onRemoveItem(item.id);
                            }
                          }}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                          title="Hapus item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - Total & Checkout */}
            {items.length > 0 && (
              <div className="border-t-2 border-border p-6 space-y-4 bg-muted">
                {/* Total harga */}
                <div className="bg-white rounded-2xl p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground">Subtotal ({totalItems} item{totalItems !== 1 ? 's' : ''})</span>
                    <span className="font-semibold text-foreground">{formatharga(total)}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg text-foreground">Total</span>
                      <span className="text-2xl font-bold text-primary">{formatharga(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-linear-to-r from-primary to-[#ff5722] hover:from-[#ff5722] hover:to-primary text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Lanjut ke Checkout
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Biaya pengiriman akan dihitung di halaman checkout
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}