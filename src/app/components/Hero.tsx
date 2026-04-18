export default function Hero() {
  return (
    <section id="beranda" className="relative max-w-7xl bg-muted  mx-auto px-6 py-20 overflow-hidden">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Teks Sebelah Kiri */}
        <div className="flex-1 text-center lg:text-left z-10">
          <span className="bg-orange-100 inline-block mt-5 text-[#FF8C00] px-4 py-2 rounded-full text-sm font-bold tracking-wide">
            STOK TERBATAS SETIAP HARI!
          </span>
          <h1 className="text-5xl lg:text-7xl font-black text-[#4B2C20] mt-6 leading-tight">
            Nikmati Camilan <br />
            <span className="text-[#FF8C00]">Premium</span> Spesial.
          </h1>
          <p className="text-gray-500 mt-6 text-lg max-w-lg">
            Dibuat dengan bahan pilihan dan resep rahasia untuk menemani waktu santai kamu jadi lebih bermakna.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
            <a href="#menu" className="bg-[#FF8C00] text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-orange-200 hover:scale-105 transition-transform">
              Pesan Sekarang
            </a>
            {/* <button className="bg-white text-[#4B2C20] border-2 border-gray-100 px-8 py-4 rounded-2xl font-bold hover:bg-gray-50 transition-colors">
              Lihat Promo
            </button> */}
          </div>
        </div>

        {/* Bagian Gambar Kanan Hiasan Bulat */}
        <div className="flex-1 relative">
          {/* Hiasan Oren 1 */}
          <div className="absolute top-1/2 left-1/2 -z-1 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-orange-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
          
          {/* Hiasan Oren 2 */}
          <div className="absolute -z-10 -top-4 -right-1 w-24 h-24 bg-[#FF8C00] rounded-full opacity-100 animate-bounce delay-100"></div>
          <div className="absolute -z-10 -bottom-8 -left-8 w-32 h-32 bg-[#FF8C00] rounded-full opacity-100 animate-bounce delay-50"></div>
          
          {/* Frame Gambar Utama */}
          <div className="relative w-80 h-80 lg:w-112.5 lg:h-112.5 mx-auto">
            <div className="absolute inset-0 border-12 border-orange-50 rounded-full shadow-inner"></div>
            <div className="w-full h-full rounded-full overflow-hidden border-8 border-white shadow-2xl relative z-10">
              <img 
                src="/products/pizza.webp"
                alt="Snack Premium" 
                className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700"
              />
            </div>

           
            <div className="absolute bottom-10 right-0 lg:right-10 z-20 bg-white p-4 rounded-2xl shadow-xl border border-orange-50 flex items-center gap-3 animate-up-down">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[#FF8C00]">
                ⭐
              </div>
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase">Trusted Snack</p>
                <p className="text-sm font-black text-[#4B2C20]">4.9/5 Rating</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}