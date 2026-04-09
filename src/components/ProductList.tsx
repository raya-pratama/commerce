"use client";
import { useState } from "react";

export default function ProductList({ products }: { products: any[] }) {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const currentItems = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <section id="menu" className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-[#4B2C20]">Semua Menu Kami</h2>
                <div className="w-20 h-1.5 bg-[#FF8C00] mx-auto mt-4 rounded-full"></div>
            </div>

            {/* Grid: 1 Mobile, 2 Medium, 3 Laptop */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {currentItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-white rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all group">
                        {/* Thumbnail Kecil */}
                       <div className="aspect-square rounded-1.5rem overflow-hidden mb-6 bg-gray-100">
                      {item.gambar ? (
                         <img 
                        src={item.gambar} 
                        alt={item.nama} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Tanpa Foto
                    </div>
                    )}
            </div>

                        <div className="flex flex-col justify-between py-1">
                            <div>
                                <h4 className="font-bold text-[#4B2C20] text-lg leading-tight">{item.nama}</h4>
                                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.deskripsi}</p>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-[#FF8C00]">Rp {item.harga.toLocaleString()}</span>
                                <button className="text-xs font-bold text-[#4B2C20] underline hover:text-[#FF8C00]">Pesan</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center mt-16 gap-3">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        className="p-3 rounded-xl bg-gray-100 text-[#4B2C20] disabled:opacity-30"
                    >
                        ←
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1 ? "bg-[#FF8C00] text-white shadow-lg shadow-orange-200" : "bg-gray-50 text-gray-400 hover:bg-orange-50"
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        className="p-3 rounded-xl bg-gray-100 text-[#4B2C20] disabled:opacity-30"
                    >
                        →
                    </button>
                </div>
            )}
        </section>
    );
}