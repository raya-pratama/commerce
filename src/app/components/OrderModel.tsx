"use client";
import { useState } from "react";

export default function OrderModal({ product, onClose }: { product: any, onClose: () => void }) {
  const [qty, setQty] = useState(1);
  const [method, setMethod] = useState("ambil"); 
  const shippingFee = method === "antar" ? 2000 : 0;
  const totalPrice = (product.harga * qty) + shippingFee;

  const handleWA = () => {
    const phone = "6285792108262";
    const text = `Halo, saya mau pesan:%0A%0A*${product.nama}*%0A- Jumlah: ${qty}%0A- Metode: ${method === 'antar' ? 'Antar ke Rumah' : 'Ambil Sendiri'}%0A- Ongkir: Rp ${shippingFee.toLocaleString()}%0A*Total Bayar: Rp ${totalPrice.toLocaleString()}*%0A%0AMohon diproses ya, terimakasih!`;
    
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="relative h-48">
          <img src={product.gambar} className="w-full h-full object-cover" alt={product.nama} onError={(e) => {
                    (e.target as HTMLImageElement).src = "/products/pizzaa.webp";
                  }}/>
          <button onClick={onClose} className="absolute top-4 right-4 bg-white/20 backdrop-blur-md text-white p-2 rounded-full w-10 h-10 font-bold">✕</button>
        </div>

        <div className="p-8">
          <h2 className="text-2xl font-black text-[#4B2C20]">{product.nama}</h2>
          <p className="text-gray-400 text-sm mt-1">{product.deskripsi}</p>

          {/* Control Jumlah */}
          <div className="flex items-center justify-between mt-8 bg-gray-50 p-3 rounded-2xl">
            <span className="font-bold text-gray-500">Jumlah</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center font-bold">-</button>
              <span className="font-bold text-[#4B2C20]">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-full bg-[#4B2C20] text-white flex items-center justify-center font-bold">+</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button 
              onClick={() => setMethod("ambil")}
              className={`py-3 rounded-2xl font-bold text-sm transition-all ${method === "ambil" ? "bg-[#FF8C00] text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}
            >
              Ambil Sendiri
            </button>
            <button 
              onClick={() => setMethod("antar")}
              className={`py-3 rounded-2xl font-bold text-sm transition-all ${method === "antar" ? "bg-[#FF8C00] text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}
            >
              Antar (+2k)
            </button>
          </div>

          {/* Total & Beli */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400">Total Pembayaran</span>
              <span className="text-xl font-black text-[#FF8C00]">Rp {totalPrice.toLocaleString()}</span>
            </div>
            <button 
              onClick={handleWA}
              className="w-full bg-[#4B2C20] text-white py-4 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-orange-100"
            >
              Beli Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}