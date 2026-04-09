// src/components/Hero.tsx
export default function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-12 md:py-24 flex flex-col md:flex-row items-center gap-10">
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#4B2C20] leading-tight">
          Camilan <span className="text-[#FF8C00]">Authentic</span> <br /> Untuk Harimu
        </h1>
        <p className="text-gray-600 mt-6 text-lg">Nikmati sensasi renyah dan bumbu rahasia yang bikin nagih di setiap gigitan.</p>
        <button className="mt-8 bg-[#FF8C00] text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform">
          Pesan Sekarang
        </button>
      </div>
      <div className="flex-1 w-full">
        <div className="relative w-full aspect-square md:aspect-video rounded-2rem overflow-hidden shadow-2xl border-8 border-white">
          <img src="/hero-image.jpg" alt="Snack" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>
  )
}