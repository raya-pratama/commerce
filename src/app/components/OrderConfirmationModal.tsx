"use client";
import { useState } from 'react';
import { X, MessageCircle, MapPin, Package, User, Phone, Loader2 } from 'lucide-react';
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
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [fulfillmentMethod, setFulfillmentMethod] = useState<'pickup' | 'delivery'>('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleWhatsAppOrder = async () => {
    // Validasi Dasar
    if (!customerName || !customerPhone) {
      alert("Harap isi Nama dan Nomor Telepon terlebih dahulu!");
      return;
    }

    if (fulfillmentMethod === 'delivery' && !deliveryAddress.trim()) {
      alert("Harap isi alamat pengiriman lengkap!");
      return;
    }

    setIsSubmitting(true);

    // 1. Data untuk dikirim ke API / Google Sheets
    const orderData = {
      nama: customerName,
      telepon: customerPhone,
      alamat: fulfillmentMethod === 'delivery' ? deliveryAddress : 'Ambil di Toko',
      total_harga: total,
      metode: fulfillmentMethod,
      tanggal: new Date().toLocaleString('id-ID'),
    };

    try {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData),
  });

  const result = await res.json();

  if (!res.ok) {
    // Tampilkan error spesifik dari server
    throw new Error(result.error || "Gagal menyimpan data");
  }

      // 3. Susun Pesan WhatsApp
      let message = '🍽️ *PESANAN BARU - FOODADMIN*\n\n';
      message += `👤 *Nama:* ${customerName}\n`;
      message += `📞 *Telp:* ${customerPhone}\n\n`;
      message += `📦 *Detail Pesanan:*\n`;
      
      items.forEach((item, index) => {
        message += `${index + 1}. ${item.nama} (${item.quantity}x) - ${formatPrice(item.harga * item.quantity)}\n`;
      });
      
      message += `\n*Subtotal:* ${formatPrice(subtotal)}\n`;
      message += `*Metode:* ${fulfillmentMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar'}\n`;
      
      if (fulfillmentMethod === 'delivery') {
        message += `*Ongkir:* ${formatPrice(deliveryFee)}\n`;
        message += `*Alamat:* ${deliveryAddress}\n`;
      }
      
      message += `\n*TOTAL BAYAR:* ${formatPrice(total)}`;

      // 4. Redirect ke WhatsApp
      const whatsappUrl = `https://wa.me/6285792108262?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      
      // Reset & Close
      onClose();
    } catch (err: any) {
  console.error("Frontend Error:", err);
  alert(`Waduh! ${err.message}`); // Sekarang alert akan kasih tau error aslinya
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between bg-white shrink-0">
                <h2 className="text-xl font-black text-gray-800 uppercase tracking-tight">Konfirmasi Pesanan</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="p-6 space-y-6 overflow-y-auto overflow-x-hidden">
                {/* Section 1: Identitas */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-400 text-xs uppercase tracking-widest">Data Pelanggan</h3>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="text" placeholder="Nama Lengkap" 
                        value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input 
                        type="tel" placeholder="No. WhatsApp (0812...)" 
                        value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Ringkasan Item */}
                <div className="space-y-3">
                  <h3 className="font-black text-gray-400 text-xs uppercase tracking-widest">Daftar Belanja</h3>
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl">
                      <div>
                        <p className="font-bold text-gray-800">{item.nama}</p>
                        <p className="text-xs text-gray-400">{item.quantity}x @ {formatPrice(item.harga)}</p>
                      </div>
                      <p className="font-black text-gray-800">{formatPrice(item.harga * item.quantity)}</p>
                    </div>
                  ))}
                </div>

                {/* Section 3: Metode Pengiriman */}
                <div className="space-y-4">
                  <h3 className="font-black text-gray-400 text-xs uppercase tracking-widest">Pengiriman</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setFulfillmentMethod('pickup')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillmentMethod === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      <Package className={fulfillmentMethod === 'pickup' ? 'text-orange-500' : 'text-gray-300'} />
                      <span className={`text-sm font-black ${fulfillmentMethod === 'pickup' ? 'text-orange-700' : 'text-gray-400'}`}>Ambil Sendiri</span>
                    </button>
                    <button
                      onClick={() => setFulfillmentMethod('delivery')}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillmentMethod === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}
                    >
                      <MapPin className={fulfillmentMethod === 'delivery' ? 'text-orange-500' : 'text-gray-300'} />
                      <span className={`text-sm font-black ${fulfillmentMethod === 'delivery' ? 'text-orange-700' : 'text-gray-400'}`}>Diantar</span>
                    </button>
                  </div>

                  {fulfillmentMethod === 'delivery' && (
                    <motion.textarea
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                      placeholder="Masukkan alamat pengiriman lengkap..."
                      value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none font-medium resize-none"
                      rows={3}
                    />
                  )}
                </div>
              </div>

              {/* Footer Button */}
              <div className="p-6 bg-white border-t shrink-0">
                <div className="flex justify-between items-center mb-4 px-2">
                  <span className="text-gray-400 font-bold uppercase text-xs">Total Pembayaran</span>
                  <span className="text-2xl font-black text-orange-600">{formatPrice(total)}</span>
                </div>
                
                <button
                  onClick={handleWhatsAppOrder}
                  disabled={isSubmitting}
                  className="w-full bg-[#25D366] text-white py-5 rounded-3xl font-black text-lg shadow-xl shadow-green-100 hover:bg-[#1eb956] transition-all flex items-center justify-center gap-3 disabled:bg-gray-300 disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      <MessageCircle className="w-6 h-6" />
                      PESAN VIA WHATSAPP
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}