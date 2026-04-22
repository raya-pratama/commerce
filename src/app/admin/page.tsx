"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { 
  CheckCircle, 
  Menu, 
  Wallet, 
  ShoppingBag, 
  Loader2, 
  Clock, 
  MapPin, 
  Phone 
} from "lucide-react";

export default function DashboardPage() {
  // State untuk Mobile Sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // State untuk Data Order
  const [data, setData] = useState({ 
    stats: { totalRevenue: 0, totalOrders: 0 }, 
    recentOrders: [] 
  });
  const [loading, setLoading] = useState(true);

  // Fungsi ambil data dari Google Sheets via API
  const fetchData = async () => {
    try {
      const res = await fetch('/api/orders');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      }
    } catch (err) {
      console.error("Gagal mengambil data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi hapus pesanan (Tandai Selesai)
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Apakah pesanan ini sudah selesai diproses? Data akan dihapus dari daftar aktif.")) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        fetchData(); // Refresh data setelah hapus
      } else {
        alert("Gagal menghapus data di server.");
      }
    } catch (err) {
      alert("Terjadi kesalahan koneksi.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col lg:flex-row">
      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Content Area */}
      <main className="flex-1 lg:ml-72 transition-all duration-300">
        
        {/* Top Navbar Mobile Only */}
        <div className="lg:hidden flex items-center justify-between p-6 bg-white border-b sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <ShoppingBag size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tight">DASHBOARD</h1>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl border border-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        {/* Main Content Padding */}
        <div className="p-6 md:p-10 lg:p-12">
          
          {/* Header Desktop */}
          <header className="hidden lg:flex flex-col mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight">Ringkasan Bisnis</h1>
            <p className="text-gray-400 font-medium mt-1">Pantau pesanan masuk dan pendapatan hari ini.</p>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Card Pemasukan */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-orange-200 transition-all">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-orange-50 text-orange-600 rounded-[1.8rem] flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
                <Wallet className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Total Pemasukan</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  Rp {data.stats.totalRevenue.toLocaleString('id-ID')}
                </h2>
              </div>
            </div>

            {/* Card Total Pesanan */}
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-blue-200 transition-all">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-50 text-blue-600 rounded-[1.8rem] flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em] mb-1">Pesanan Aktif</p>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900">
                  {data.stats.totalOrders} <span className="text-sm text-gray-300 font-bold ml-1 uppercase">Order</span>
                </h2>
              </div>
            </div>
          </div>

          {/* Tabel Pesanan */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
              Pesanan Terbaru
              <span className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">{data.recentOrders.length}</span>
            </h3>
          </div>

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-200">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Pembeli</th>
                    <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Metode & Alamat</th>
                    <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Waktu</th>
                    <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-right">Total</th>
                    <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Loader2 className="w-10 h-10 text-orange-500 animate-spin" />
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Menyelaraskan Data...</p>
                        </div>
                      </td>
                    </tr>
                  ) : data.recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-20 text-center text-gray-400 font-bold uppercase text-xs tracking-widest">
                        Belum ada pesanan masuk hari ini
                      </td>
                    </tr>
                  ) : (
                    data.recentOrders.map((order: any) => (
                      <tr key={order.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="p-6">
                          <div className="flex flex-col">
                            <span className="font-black text-gray-900">{order.nama}</span>
                            <div className="flex items-center gap-1 text-gray-400 text-xs mt-1 font-bold">
                              <Phone size={12} />
                              {order.telepon}
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex flex-col gap-2">
                            <span className={`w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              order.metode === 'delivery' 
                                ? 'bg-orange-100 text-orange-600' 
                                : 'bg-blue-100 text-blue-600'
                            }`}>
                              {order.metode === 'delivery' ? '🚗 Delivery' : '🏢 Pickup'}
                            </span>
                            <div className="flex items-start gap-1 text-gray-500 text-xs max-w-50">
                              <MapPin size={12} className="shrink-0 mt-0.5" />
                              <span className="truncate">{order.alamat}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-6">
                          <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                            <Clock size={14} className="text-gray-300" />
                            {order.tanggal.split(',')[1] || order.tanggal}
                          </div>
                        </td>
                        <td className="p-6 text-right font-black text-orange-600 text-lg">
                          Rp {order.total.toLocaleString('id-ID')}
                        </td>
                        <td className="p-6 text-center">
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all shadow-sm hover:shadow-green-200"
                            title="Selesaikan Pesanan"
                          >
                            <CheckCircle className="w-6 h-6" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}