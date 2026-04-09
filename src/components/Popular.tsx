export default function Popular({ products }: { products: any[] }) {
  // Ambil 3 produk pertama sebagai produk populer
  const popularItems = products.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 bg-orange-50/50 rounded-[3rem] my-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10">
        <div>
          <span className="text-[#FF8C00] font-bold tracking-widest uppercase text-sm">Paling Dicari</span>
          <h2 className="text-4xl font-extrabold text-[#4B2C20] mt-2">Popular Food</h2>
        </div>
        <p className="text-gray-500 max-w-xs text-right hidden md:block">
          Produk unggulan kami yang paling banyak dipesan minggu ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {popularItems.map((item) => (
          <div key={item.id} className="relative group bg-white p-4 rounded-2rem shadow-xl shadow-orange-100/50 border border-white hover:-translate-y-2 transition-all duration-300">
            {/* Label Best Seller */}
            <div className="absolute top-6 left-6 bg-[#FF8C00] text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg">
              BEST SELLER
            </div>
            
            <div className="aspect-square rounded-1.5rem overflow-hidden mb-6">
              <img src={item.gambar} alt={item.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            </div>
            
            <div className="px-2">
              <h3 className="text-2xl font-bold text-[#4B2C20]">{item.nama}</h3>
              <p className="text-gray-400 text-sm mt-2 line-clamp-2">{item.deskripsi}</p>
              <div className="flex justify-between items-center mt-6">
                <span className="text-xl font-black text-[#FF8C00]">Rp {item.harga.toLocaleString()}</span>
                <button className="bg-[#4B2C20] p-3 rounded-xl hover:bg-[#FF8C00] transition-colors group/btn">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}