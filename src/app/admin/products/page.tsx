"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";



interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  image: string;
  description: string;
}

export default function ProductManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [form, setForm] = useState({
    produk: "", kategori: "Makanan", harga: "", stok: "", gambar: "", deskripsi: ""
  });

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openAddModal = () => {
    setIsEdit(false);
    setForm({ produk: "", kategori: "Makanan", harga: "", stok: "", gambar: "", deskripsi: "" });
    setShowModal(true);
  };

  const openEditModal = (p: Product) => {
    setIsEdit(true);
    setCurrentId(p.id);
    setForm({
      produk: p.name, kategori: p.category, harga: p.price,
      stok: p.stock, gambar: p.image, deskripsi: p.description
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const method = isEdit ? 'PATCH' : 'POST';
    const body = isEdit ? { ...form, id: currentId } : form;

    try {
      const res = await fetch('/api/products', {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      }
    } finally { setIsSubmitting(false); }
  };
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setIsUploading(true);
  const formData = new FormData();
  formData.append("file", file); // Nama harus "file"

  try {
    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData, // Jangan pakai headers Content-Type manual kalau pakai FormData
    });
    const data = await res.json();
    
    if (res.ok) {
      setForm((prev) => ({ ...prev, gambar: data.url }));
    } else {
      alert("Gagal: " + data.error);
    }
  } catch (err) {
    alert("Koneksi ke API upload gagal");
  } finally {
    setIsUploading(false);
  }
};
  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini?")) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-64 p-10 bg-gray-50 min-h-screen">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-5xl font-black text-gray-900">Products</h2>
          <button onClick={openAddModal} className="bg-[#FF7043] text-white px-8 py-4 rounded-full font-black shadow-lg hover:scale-105 transition-all">
            + Add New Product
          </button>
        </header>

        {showModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
    <div className="bg-white p-8 rounded-4xl w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-black text-gray-800">{isEdit ? '✏️ Edit Produk' : '✨ Tambah Produk Baru'}</h3>
        <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-2xl">&times;</button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Input Nama Produk */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Nama Produk</label>
          <input required placeholder="Contoh: Nasi Goreng Spesial" className="w-full border p-3 rounded-xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none" 
            value={form.produk} onChange={e => setForm({...form, produk: e.target.value})} />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {/* Input Kategori */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Kategori</label>
            <select className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" 
              value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          {/* Input Harga */}
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">Harga (Rp)</label>
            <input required type="number" placeholder="15000" className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" 
              value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} />
          </div>
        </div>

        {/* --- BAGIAN UPLOAD GAMBAR BARU --- */}
        <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-gray-200">
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Foto Produk</label>
          <div className="mt-3 flex items-center gap-5">
            {/* Preview Box */}
            <div className="w-24 h-24 rounded-2xl bg-white border-2 border-gray-100 shadow-sm overflow-hidden flex items-center justify-center shrink-0">
              {form.gambar ? (
                <img src={form.gambar} className="w-full h-full object-cover" alt="Preview" />
              ) : (
                <span className="text-[10px] text-gray-400 font-bold text-center px-2">No Photo Yet</span>
              )}
            </div>
            
            <div className="flex-1">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-orange-100 file:text-orange-700 hover:file:bg-orange-200 cursor-pointer"
              />
              {isUploading ? (
                <p className="text-[11px] text-orange-600 mt-2 animate-pulse font-bold">🚀 Sedang mengupload file...</p>
              ) : (
                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">*Format .jpg, .png max 2MB</p>
              )}
            </div>
          </div>
          {/* Input hidden untuk menyimpan path gambar yang dapet dari API upload */}
          <input type="hidden" value={form.gambar} />
        </div>
        {/* --- END UPLOAD GAMBAR --- */}

        {/* Input Stok */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Stok Tersedia</label>
          <input required type="number" placeholder="0" className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500" 
            value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} />
        </div>
        
        {/* Input Deskripsi */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase ml-1">Deskripsi Singkat</label>
          <textarea rows={3} placeholder="Ceritakan rasa atau isi porsi produk ini..." className="w-full border p-3 rounded-xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 resize-none" 
            value={form.deskripsi} onChange={e => setForm({...form, deskripsi: e.target.value})} />
        </div>

        {/* Tombol Aksi */}
        <div className="flex gap-4 pt-4">
          <button 
            type="button" 
            onClick={() => setShowModal(false)} 
            className="flex-1 py-4 font-black text-gray-400 hover:text-gray-600 transition-colors"
          >
            BATAL
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting || isUploading}
            className={`flex-1 py-4 rounded-2xl font-black text-white shadow-lg transition-all 
              ${isSubmitting || isUploading ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#FF7043] hover:bg-[#f4511e] hover:shadow-orange-200'}`}
          >
            {isSubmitting ? 'MENYIMPAN...' : 'SIMPAN PRODUK'}
          </button>
        </div>
      </form>
    </div>
  </div>
)}

        <div className="bg-white rounded-4xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#5D4037] text-white">
              <tr>
                <th className="p-6">Produk</th>
                <th className="p-6">Harga</th>
                <th className="p-6 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} className="p-20 text-center font-bold">Loading...</td></tr>
              ) : products.map((p) => (
                <tr key={p.id} className="border-b">
                  <td className="p-6 flex items-center gap-4">
                    <img src={p.image} className="w-16 h-16 rounded-xl object-cover" />
                    <span className="font-bold">{p.name}</span>
                  </td>
                  <td className="p-6 font-black text-orange-600">Rp {Number(p.price).toLocaleString()}</td>
                  <td className="p-6 text-center">
                    <button onClick={() => openEditModal(p)} className="text-blue-500 mr-4 font-bold">Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 font-bold">Hapus</button>
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