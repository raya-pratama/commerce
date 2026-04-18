"use client";
import { Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const lokasi = "-7.399210258388647, 112.5963157917556"; 
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${lokasi}`;
  
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.273872274438!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sid!2sid!4v1712680000000!5m2!1sid!2sid";

  return (
    <footer id="contact" className="bg-[#4B2C20] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Kolom 1: Brand & Kontak */}
          <div className="md:col-span-4 space-y-6">
            <div>
              <h2 className="text-3xl font-black text-[#FF8C00]">DelFod</h2>
              <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                Menyajikan kebahagiaan lewat camilan manis dan makanan lezat setiap hari. Kualitas bahan adalah prioritas kami.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="text-[#FF8C00] w-5 h-5 shrink-0" />
                <span className="text-sm">Jl. Jendral Sudirman No. 123, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="text-[#FF8C00] w-5 h-5 shrink-0" />
                <span className="text-sm">+62 812 3456 7890</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="text-[#FF8C00] w-5 h-5 shrink-0" />
                <span className="text-sm">halo@delfod.com</span>
              </div>
            </div>

           
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div className="md:col-span-2">
            <h4 className="font-bold text-lg mb-6 border-l-4 border-[#FF8C00] pl-3">Navigasi</h4>
            <ul className="space-y-4 text-gray-300 text-sm">
              <li><a href="#home" className="hover:text-[#FF8C00] transition-colors">Home</a></li>
              <li><a href="#popular" className="hover:text-[#FF8C00] transition-colors">Populer</a></li>
              <li><a href="#menu" className="hover:text-[#FF8C00] transition-colors">Menu</a></li>
              <li><a href="#testimoni" className="hover:text-[#FF8C00] transition-colors">Testimoni</a></li>
            </ul>
          </div>

          {/* Kolom 3: Google Maps (Set Lokasi Sendiri) */}
          <div className="md:col-span-6">
            <h4 className="font-bold text-lg mb-6 border-l-4 border-[#FF8C00] pl-3">Lokasi Kami</h4>
            <div className="w-full h-62.5 rounded-4xl overflow-hidden border-4 border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src={mapEmbedUrl}
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

        </div>

       
      </div>
    </footer>
  );
}