"use client";
import { useState, useEffect } from "react";

const testimonials = [
  {
    id: 1,
    nama: "Rizky Pratama",
    peran: "Pelanggan Setia",
    komentar: "Snack-nya enak banget, bumbunya pas dan nggak pelit. Dorayakinya paling juara sih!",
    rating: 5,
    foto: "https://i.pravatar.cc/150?u=1"
  },
  {
    id: 2,
    nama: "Siti Aminah",
    peran: "Food Blogger",
    komentar: "Pengirimannya cepat dan packingnya rapi banget. Masih hangat pas sampai di rumah.",
    rating: 5,
    foto: "https://i.pravatar.cc/150?u=2"
  },
  {
    id: 3,
    nama: "Budi Santoso",
    peran: "Mahasiswa",
    komentar: "Harganya sangat bersahabat buat kantong pelajar tapi rasanya kelas restoran bintang lima.",
    rating: 4,
    foto: "https://i.pravatar.cc/150?u=3"
  }
];

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="testimoni" className="w-full py-16 bg-orange-50/30">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <span className="text-[#FF8C00] font-black tracking-widest uppercase text-[10px]">
            Testimoni
          </span>
          <h2 className="text-3xl font-black text-[#4B2C20]">
            Apa Kata <span className="text-[#FF8C00]">Mereka?</span>
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="flex md:grid md:grid-cols-3 gap-8 overflow-x-auto md:overflow-visible pb-6 scrollbar-hide snap-x snap-mandatory">
          {testimonials.map((testi) => (
            <div 
              key={testi.id}
              className="min-w-75 w-full md:min-w-0 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-start snap-center relative"
            >
              <div className="absolute top-6 right-8 text-orange-100">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 7.55228 14.017 7V5C14.017 4.44772 14.4647 4 15.017 4H20.017C21.1216 4 22.017 4.89543 22.017 6V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 7.55228 3.017 7V5C3.017 4.44772 3.46472 4 4.017 4H9.017C10.1216 4 11.017 4.89543 11.017 6V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" />
                </svg>
              </div>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg 
                    key={i}
                    className={`w-4 h-4 ${i < testi.rating ? 'text-[#FF8C00]' : 'text-gray-200'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <p className="text-[#4B2C20] text-sm font-medium leading-relaxed italic mb-8">
                "{testi.komentar}"
              </p>

              <div className="mt-auto flex items-center gap-4">
                <img 
                  src={testi.foto} 
                  alt={testi.nama}
                  className="w-12 h-12 rounded-full border-2 border-[#FF8C00] p-0.5"
                />
                <div className="text-left">
                  <h4 className="text-sm font-bold text-[#4B2C20]">{testi.nama}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
                    {testi.peran}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}