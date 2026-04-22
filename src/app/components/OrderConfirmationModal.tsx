"use client";
import { useState } from 'react';
import { X, MessageCircle, MapPin, Package, User, Phone, Loader2, CreditCard, Banknote } from 'lucide-react';
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
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
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

  const handleProcessOrder = async () => {
    // 1. Validasi
    if (!customerName || !customerPhone) {
      alert("Harap isi Nama dan Nomor Telepon!");
      return;
    }
    if (fulfillmentMethod === 'delivery' && !deliveryAddress.trim()) {
      alert("Alamat pengiriman harus diisi!");
      return;
    }

    setIsSubmitting(true);

    try {
      // 2. Jika pilih ONLINE, ambil Token Midtrans dulu
      let midtransToken = "";
      if (paymentMethod === 'online') {
        const midRes = await fetch('/api/checkout/midtrans', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nama: customerName,
    telepon: customerPhone,
    total_harga: total,
    items: items,
    metode: fulfillmentMethod // PENTING: Tambahkan ini agar API bisa cek ongkir
  }),
});
        const midData = await midRes.json();
        if (!midRes.ok) throw new Error(midData.error || "Gagal koneksi ke Midtrans");
        midtransToken = midData.token;
      }

      // 3. Simpan ke Google Sheets via API Orders
      const orderData = {
        nama: customerName,
        telepon: customerPhone,
        alamat: fulfillmentMethod === 'delivery' ? deliveryAddress : 'Ambil di Toko',
        total_harga: total,
        metode: fulfillmentMethod,
        pembayaran: paymentMethod,
        tanggal: new Date().toLocaleString('id-ID'),
        status: paymentMethod === 'online' ? 'Pending (Midtrans)' : 'COD'
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) throw new Error("Gagal menyimpan data ke database");

      // 4. Eksekusi Pembayaran atau WhatsApp
      if (paymentMethod === 'online' && midtransToken) {
        // @ts-ignore (Mengabaikan error window.snap karena script di-load eksternal)
        window.snap.pay(midtransToken, {
          onSuccess: () => {
            sendWA(orderData, "SUDAH BAYAR (ONLINE)");
            onClose();
          },
          onPending: () => {
            sendWA(orderData, "MENUNGGU PEMBAYARAN");
            onClose();
          },
          onClose: () => {
            alert("Kamu menutup jendela pembayaran sebelum selesai.");
          }
        });
      } else {
        // Langsung WA jika COD
        sendWA(orderData, "COD (BAYAR DI TEMPAT)");
        onClose();
      }

    } catch (err: any) {
      console.error(err);
      alert(`Waduh! ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fungsi Kirim WA (Dipisah biar rapi)
  const sendWA = (data: any, paymentStatus: string) => {
    let message = `🍽️ *PESANAN BARU - ${paymentStatus}*\n\n`;
    message += `👤 *Nama:* ${data.nama}\n`;
    message += `📞 *Telp:* ${data.telepon}\n\n`;
    message += `📦 *Detail Pesanan:*\n`;
    items.forEach((item, index) => {
      message += `${index + 1}. ${item.nama} (${item.quantity}x)\n`;
    });
    message += `\n*TOTAL BAYAR:* ${formatPrice(total)}\n`;
    message += `*Metode:* ${fulfillmentMethod === 'pickup' ? 'Ambil Sendiri' : 'Diantar'}\n`;
    if (fulfillmentMethod === 'delivery') message += `*Alamat:* ${deliveryAddress}\n`;

    const whatsappUrl: string = `https://wa.me/6285792108262?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Tambahkan Script Midtrans (Sandbox) */}
      <script 
        src="https://app.sandbox.midtrans.com/snap/snap.js" 
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
      />

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-white rounded-[2.5rem] shadow-2xl max-w-lg w-full max-h-[85vh] overflow-hidden pointer-events-auto flex flex-col">
                
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between bg-white shrink-0">
                  <h2 className="text-xl font-black text-gray-800 uppercase">Konfirmasi Pesanan</h2>
                  <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full"><X className="w-6 h-6 text-gray-400" /></button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto">
                  {/* Data Pelanggan */}
                  <div className="space-y-3">
                    <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Data Pelanggan</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Nama Lengkap" value={customerName} onChange={(e) => setCustomerName(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold" />
                      </div>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="tel" placeholder="No. WhatsApp" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none font-bold" />
                      </div>
                    </div>
                  </div>

                  {/* Metode Pengiriman */}
                  <div className="space-y-3">
                    <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Metode Pengiriman</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setFulfillmentMethod('pickup')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillmentMethod === 'pickup' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <Package className={fulfillmentMethod === 'pickup' ? 'text-orange-500' : 'text-gray-300'} />
                        <span className={`text-[10px] font-black uppercase ${fulfillmentMethod === 'pickup' ? 'text-orange-700' : 'text-gray-400'}`}>Ambil Sendiri</span>
                      </button>
                      <button onClick={() => setFulfillmentMethod('delivery')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${fulfillmentMethod === 'delivery' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <MapPin className={fulfillmentMethod === 'delivery' ? 'text-orange-500' : 'text-gray-300'} />
                        <span className={`text-[10px] font-black uppercase ${fulfillmentMethod === 'delivery' ? 'text-orange-700' : 'text-gray-400'}`}>Diantar</span>
                      </button>
                    </div>
                    {fulfillmentMethod === 'delivery' && (
                      <textarea placeholder="Alamat lengkap..." value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-orange-500 outline-none font-medium h-20 resize-none" />
                    )}
                  </div>

                  {/* Metode Pembayaran */}
                  <div className="space-y-3">
                    <h3 className="font-black text-gray-400 text-[10px] uppercase tracking-widest">Metode Pembayaran</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={() => setPaymentMethod('cod')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'cod' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <Banknote className={paymentMethod === 'cod' ? 'text-blue-500' : 'text-gray-300'} />
                        <span className={`text-[10px] font-black uppercase ${paymentMethod === 'cod' ? 'text-blue-700' : 'text-gray-400'}`}>COD (Tunai)</span>
                      </button>
                      <button onClick={() => setPaymentMethod('online')} className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'online' ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <CreditCard className={paymentMethod === 'online' ? 'text-purple-500' : 'text-gray-300'} />
                        <span className={`text-[10px] font-black uppercase ${paymentMethod === 'online' ? 'text-purple-700' : 'text-gray-400'}`}>Online (QRIS)</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 bg-white border-t shrink-0">
                  <div className="flex justify-between items-center mb-4 px-2">
                    <span className="text-gray-400 font-bold uppercase text-[10px]">Total Bayar</span>
                    <span className="text-2xl font-black text-orange-600">{formatPrice(total)}</span>
                  </div>
                  <button
                    onClick={handleProcessOrder}
                    disabled={isSubmitting}
                    className={`w-full py-5 rounded-3xl font-black text-lg shadow-xl flex items-center justify-center gap-3 transition-all ${paymentMethod === 'online' ? 'bg-purple-600 shadow-purple-100 hover:bg-purple-700' : 'bg-[#25D366] shadow-green-100 hover:bg-[#1eb956]'} text-white disabled:bg-gray-300`}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin" /> : (
                      paymentMethod === 'online' ? <><CreditCard /> BAYAR SEKARANG</> : <><MessageCircle /> PESAN VIA WA</>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}