import React from 'react';

const Navbar = () => {
  return (
    <div className="fixed top-6 w-full z-50 px-4 flex justify-center">
      <nav className="
        w-full max-w-5xl 
        bg-white/90 backdrop-blur-xl 
        rounded-full px-6 py-2.5 
        flex justify-between items-center
        border border-white
        shadow-[0_0_25px_rgba(255,255,255,0.4)] 
        transition-all duration-500
      ">
      
        <div className="flex items-center gap-3">
          <div className="
            w-10 h-10 rounded-full 
            bg-[#FF8C00] 
            flex items-center justify-center 
            text-black font-black text-sm
            shadow-[0_0_10px_rgba(5,150,105,0.3)]
          ">
            DF
          </div>
          <span className="font-bold tracking-tighter text-black hidden sm:block">
            DelFod<span className="text-[#FF8C00]"></span>
          </span>
        </div>

    
        <div className="flex gap-6 md:gap-10 text-xs md:text-sm font-bold text-gray-800">
          <a href="#home" className="hover:text-[#FF8C00] transition">Home</a>
          <a href="#katalog" className="hover:text-[#FF8C00] transition">Katalog</a>
          <a href="#contact" className="hover:text-[#FF8C00] transition">Contact</a>
          <a href="#projects" className="hover:text-[#FF8C00] transition">About</a>
        </div>

      
        <div className="">
          <a href="#footer" className="
            px-6 py-2 
            bg-[#FF8C00] 
            text-black rounded-full 
            text-xs font-bold 
            hover:bg-[#c06a01] 
            transition-all 
            shadow-[0_0_15px_rgba(5,150,105,0.4)]
          ">
            Chat Us
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;