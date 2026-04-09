// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-[#4B2C20] text-white pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
        {/* Kolom 1: Kontak Info */}
        <div>
          <h3 className="text-2xl font-bold text-[#FF8C00] mb-6">NgantriSnack</h3>
          <p className="text-gray-300 mb-4">Jl. Jajanan Enak No. 123, Jakarta Selatan</p>
          <p className="text-gray-300">WhatsApp: +62 812 3456 789</p>
          <p className="text-gray-300">Email: halo@ngantrisnack.com</p>
          
          {/* Google Maps Embed */}
          <div className="mt-6 rounded-xl overflow-hidden h-48 w-full border-2 border-orange-400">
            <iframe 
              src="https://www.google.com/maps/embed?..." 
              className="w-full h-full" 
              loading="lazy"
            ></iframe>
          </div>
        </div>

        {/* Kolom 2: Form Email */}
        <div className="bg-white/10 p-8 rounded-3xl backdrop-blur-sm">
          <h4 className="text-xl font-bold mb-6">Kirim Pesan</h4>
          <form className="space-y-4">
            <input type="text" placeholder="Nama" className="w-full p-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none" />
            <textarea placeholder="Pesan" className="w-full p-3 rounded-xl bg-white/20 border border-white/30 h-24"></textarea>
            <button className="w-full bg-[#FF8C00] py-3 rounded-xl font-bold hover:bg-orange-500 transition-colors">Kirim</button>
          </form>
        </div>

        {/* Kolom 3: Informasi/Link */}
        <div>
          <h4 className="text-xl font-bold mb-6">Jam Operasional</h4>
          <ul className="text-gray-300 space-y-2">
            <li>Senin - Jumat: 09.00 - 20.00</li>
            <li>Sabtu - Minggu: 10.00 - 17.00</li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-20 pt-8 border-t border-white/10 text-gray-400 text-sm">
        © 2026 NgantriSnack. Built with Next.js & Orange Spirit.
      </div>
    </footer>
  );
}