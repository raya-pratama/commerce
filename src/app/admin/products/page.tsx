"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/app/components/Sidebar";
import { 
  Search, Plus, Menu, Edit, Trash2, 
  ChevronLeft, ChevronRight, Loader2, 
  Image as ImageIcon, Package, Tag 
} from "lucide-react";

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
  // UI States
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Form States
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
      // Pastikan mapping data dari API sesuai dengan Interface Product
      // Jika API mengembalikan 'nama', kita ubah ke 'name'
      const mappedData = data.map((item: any) => ({
        id: item.id,
        name: item.name || item.nama, 
        category: item.category || item.kategori,
        price: item.price || item.harga,
        stock: item.stock || item.stok,
        image: item.image || item.gambar,
        description: item.description || item.deskripsi
      }));
      setProducts(mappedData);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

  // --- LOGIC SEARCH & PAGINATION ---
  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  // --- ACTIONS ---
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
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) setForm((prev) => ({ ...prev, gambar: data.url }));
    } finally { setIsUploading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus produk ini secara permanen?")) return;
    await fetch('/api/products', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchProducts();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-1 lg:ml-72 p-4 md:p-10">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Products</h2>
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white rounded-2xl shadow-sm">
              <Menu size={24} />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Cari menu..." 
                className="w-full sm:w-64 pl-12 pr-4 py-4 bg-white rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-orange-500 outline-none font-bold text-sm"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            <button onClick={openAddModal} className="bg-[#FF7043] text-white px-8 py-4 rounded-2xl font-black shadow-lg shadow-orange-200 hover:bg-[#f4511e] transition-all flex items-center justify-center gap-2">
              <Plus size={20} /> Add New
            </button>
          </div>
        </header>

        {/* Modal Overlay */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-60 p-4 scrollbar-hide">
            <div className="bg-white p-8 rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-y-auto max-h-[90vh] scrollbar-hide">
              <div className="flex justify-between items-center mb-6 scrollbar-hide">
                <h3 className="text-2xl font-black text-gray-800">{isEdit ? '✏️ Edit Produk' : '✨ Tambah Produk'}</h3>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 font-bold text-3xl">&times;</button>
              </div>

              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Produk</label>
                  <input required placeholder="Contoh: Nasi Goreng Spesial" className="w-full bg-gray-50 border-none p-4 rounded-2xl mt-1 focus:ring-2 focus:ring-orange-500 outline-none font-bold" 
                    value={form.produk} onChange={e => setForm({...form, produk: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori</label>
                    <select className="w-full bg-gray-50 border-none p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                      value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value})}>
                      <option value="Makanan text-black">Makanan</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Snack">Snack</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Harga (Rp)</label>
                    <input required type="number" placeholder="15000" className="w-full bg-gray-50 border-none p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                      value={form.harga} onChange={e => setForm({...form, harga: e.target.value})} />
                  </div>
                </div>

                <div className="bg-gray-50 p-5 rounded-4xl border-2 border-dashed border-gray-200">
                  <div className="flex items-center gap-5">
                    <div className="w-24 h-24 rounded-2xl bg-white border shadow-sm overflow-hidden flex items-center justify-center shrink-0">
                      {form.gambar ? <img src={form.gambar} className="w-full h-full object-cover" /> : <ImageIcon className="text-gray-200" size={32} />}
                    </div>
                    <div className="flex-1">
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:bg-orange-100 file:text-orange-700 cursor-pointer" />
                      {isUploading && <p className="text-[11px] text-orange-600 mt-2 animate-pulse font-bold">Mengupload...</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Stok</label>
                    <input required type="number" className="w-full bg-gray-50 border-none p-4 rounded-2xl mt-1 outline-none focus:ring-2 focus:ring-orange-500 font-bold" 
                      value={form.stok} onChange={e => setForm({...form, stok: e.target.value})} />
                  </div>
                  <div>
                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Aksi</label>
                     <button type="submit" disabled={isSubmitting || isUploading} className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black mt-1 disabled:bg-gray-300">
                       {isSubmitting ? '...' : 'SIMPAN'}
                     </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Table Section */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left min-w-200">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Info Menu</th>
                  <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Kategori</th>
                  <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Harga</th>
                  <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest">Stok</th>
                  <th className="p-6 font-bold text-gray-400 uppercase text-[10px] tracking-widest text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {loading ? (
                  <tr><td colSpan={5} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-orange-500" /></td></tr>
                ) : currentItems.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                        <span className="font-black text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase text-gray-500">{p.category}</span>
                    </td>
                    <td className="p-6 font-black text-orange-600">Rp {Number(p.price).toLocaleString()}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 font-bold text-gray-500 text-sm">
                        <Package size={14} className="text-gray-300" /> {p.stock}
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => openEditModal(p)} className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all"><Edit size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Section */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 px-4">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Showing {filteredProducts.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} Menus
          </p>
          <div className="flex items-center gap-2">
            <button disabled={currentPage === 1} onClick={() => setCurrentPage(c => c - 1)} className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30"><ChevronLeft size={20} /></button>
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-xl font-bold transition-all ${currentPage === i + 1 ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-400'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(c => c + 1)} className="p-3 bg-white rounded-xl shadow-sm disabled:opacity-30"><ChevronRight size={20} /></button>
          </div>
        </div>
      </main>
    </div>
  );
}