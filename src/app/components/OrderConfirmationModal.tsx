"use client";
import { useState } from 'react';
import { X, MessageCircle, MapPin, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OrderItem {
  id: number;
  nama: string;
  harga: number;
  quantity: number;
}

interface OrderConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: OrderItem[];
}

export function OrderConfirmationModal({ isOpen, onClose, items }: OrderConfirmationModalProps) {
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  const deliveryFee = 2000;
  const subtotal = items.reduce((sum, item) => sum + (item.harga * item.quantity), 0);
  const total = subtotal + (fulfillmentMethod === 'delivery' ? deliveryFee : 0);

  const formatPrice = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const handleWhatsAppOrder = () => {
    // Create order message for WhatsApp
    let message = '🍽️ *Pesanan Baru dari FoodExpress*\n\n';
    message += '*Detail Pesanan:*\n';
    
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nama} (${item.quantity}x) - ${formatPrice(item.harga * item.quantity)}\n`;
    });
    
    message += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;
    message += `*Metode Pengambilan:* ${fulfillmentMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar'}\n`;
    
    if (fulfillmentMethod === 'delivery') {
      message += `*Biaya Pengiriman:* ${formatPrice(deliveryFee)}\n`;
      message += `*Alamat Pengiriman:* ${deliveryAddress}\n`;
    }
    
    message += `\n*Total:* ${formatPrice(total)}`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281234567890?text=${encodedMessage}`;
    
    // Open WhatsApp
    window.open(whatsappUrl, '_blank');
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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto pointer-events-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-border rounded-t-3xl p-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Konfirmasi Pesanan</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-foreground" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Order Summary */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">Ringkasan Pesanan</h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between bg-muted rounded-xl p-4">
                        <div className="flex-1">
                          <div className="font-semibold text-foreground">{item.nama}</div>
                          <div className="text-sm text-muted-foreground">{item.quantity}x @ {formatPrice(item.harga)}</div>
                        </div>
                        <div className="font-bold text-primary">{formatPrice(item.harga * item.quantity)}</div>
                      </div>
                    ))}
                  </div>

                  {/* Subtotal */}
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-border">
                    <span className="text-foreground">Subtotal</span>
                    <span className="font-bold text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                {/* Fulfillment Toggle */}
                <div>
                  <h3 className="font-bold text-lg text-foreground mb-4">Metode Pengambilan</h3>
                  <div className="bg-muted rounded-2xl p-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setFulfillmentMethod('pickup')}
                      className={`py-4 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        fulfillmentMethod === 'pickup'
                          ? 'bg-white shadow-lg border-2 border-primary'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <Package className={`w-6 h-6 ${fulfillmentMethod === 'pickup' ? 'text-primary' : 'text-foreground'}`} />
                      <div className="text-center">
                        <div className={`font-semibold ${fulfillmentMethod === 'pickup' ? 'text-primary' : 'text-foreground'}`}>
                          Ambil Sendiri
                        </div>
                        <div className="text-sm text-secondary font-semibold">Gratis</div>
                      </div>
                    </button>

                    <button
                      onClick={() => setFulfillmentMethod('delivery')}
                      className={`py-4 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                        fulfillmentMethod === 'delivery'
                          ? 'bg-white shadow-lg border-2 border-primary'
                          : 'hover:bg-white/50'
                      }`}
                    >
                      <MapPin className={`w-6 h-6 ${fulfillmentMethod === 'delivery' ? 'text-primary' : 'text-foreground'}`} />
                      <div className="text-center">
                        <div className={`font-semibold ${fulfillmentMethod === 'delivery' ? 'text-primary' : 'text-foreground'}`}>
                          Diantar
                        </div>
                        <div className="text-sm text-muted-foreground">+{formatPrice(deliveryFee)}</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Conditional Address Input */}
                <AnimatePresence>
                  {fulfillmentMethod === 'delivery' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block">
                        <span className="font-bold text-foreground mb-2 block">Alamat Pengiriman Lengkap</span>
                        <textarea
                          value={deliveryAddress}
                          onChange={(e) => setDeliveryAddress(e.target.value)}
                          placeholder="Masukkan alamat lengkap Anda (Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan)"
                          rows={4}
                          className="w-full px-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        />
                      </label>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Total Price */}
                <div className="bg-linear-to-br from-primary to-[#ff5722] rounded-2xl p-6 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm opacity-90">Total Pembayaran</div>
                      <div className="text-3xl font-bold">{formatPrice(total)}</div>
                    </div>
                    {fulfillmentMethod === 'delivery' && (
                      <div className="text-right text-sm">
                        <div className="opacity-90">Termasuk biaya</div>
                        <div className="opacity-90">pengiriman</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* WhatsApp Button */}
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={fulfillmentMethod === 'delivery' && !deliveryAddress.trim()}
                  className="w-full bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-lg font-bold">Pesan via WhatsApp</span>
                </button>

                {fulfillmentMethod === 'delivery' && !deliveryAddress.trim() && (
                  <p className="text-sm text-center text-muted-foreground">
                    Mohon isi alamat pengiriman terlebih dahulu
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
