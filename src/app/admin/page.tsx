"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { Trash2, CheckCircle } from "lucide-react"; // Tambahkan icon

export default function Dashboard() {
  const [data, setData] = useState({ stats: { totalRevenue: 0, totalOrders: 0 }, recentOrders: [] });
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mengambil data
  const fetchData = async () => {
    const res = await fetch('/api/orders');
    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fungsi Hapus Pesanan
  const handleDeleteOrder = async (id: string) => {
    if (!confirm("Tandai pesanan ini sebagai selesai dan hapus dari daftar?")) return;

    try {
      const res = await fetch('/api/orders', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        // Refresh data setelah hapus
        fetchData();
      } else {
        alert("Gagal menghapus pesanan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan koneksi");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 bg-gray-50 min-h-screen">
        <h1 className="text-4xl font-black mb-10 text-gray-900">Dashboard</h1>

        {/* Statistik Cards tetap sama... */}
        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Total Revenue</p>
            <h2 className="text-3xl font-black text-gray-900">
              Rp {data.stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <p className="text-gray-400 font-bold uppercase text-xs tracking-widest mb-2">Total Orders</p>
            <h2 className="text-3xl font-black text-gray-900">{data.stats.totalOrders}</h2>
          </div>
        </div>

        {/* Tabel Pesanan */}
        <h3 className="text-2xl font-black mb-6 text-gray-900">Pesanan Aktif</h3>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-5 font-bold text-gray-600">Pelanggan</th>
                <th className="p-5 font-bold text-gray-600">Alamat / Metode</th>
                <th className="p-5 font-bold text-gray-600 text-right">Total</th>
                <th className="p-5 font-bold text-gray-600 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">Memuat pesanan...</td></tr>
              ) : data.recentOrders.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-gray-400 font-medium">Tidak ada pesanan aktif</td></tr>
              ) : data.recentOrders.map((order: any) => (
                <tr key={order.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-5">
                    <p className="font-bold text-gray-900">{order.nama}</p>
                    <p className="text-xs text-gray-500">{order.telepon}</p>
                  </td>
                  <td className="p-5 text-sm text-gray-600">
                    <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-bold mb-1 uppercase ${order.metode === 'delivery' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                      {order.metode}
                    </span>
                    <p className="truncate max-w-50">{order.alamat}</p>
                  </td>
                  <td className="p-5 text-right font-black text-orange-600">
                    Rp {order.total.toLocaleString('id-ID')}
                  </td>
                  <td className="p-5 text-center">
                    <button 
                      onClick={() => handleDeleteOrder(order.id)}
                      className="p-3 bg-green-50 text-green-600 rounded-2xl hover:bg-green-600 hover:text-white transition-all group"
                      title="Selesaikan Pesanan"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}