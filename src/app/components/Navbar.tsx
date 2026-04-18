"use client";
import { useState } from "react";
import { Menu, X, ShoppingCart, User, UtensilsCrossed } from "lucide-react";

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}
export default function Navbar({ cartCount, onCartClick }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full bg-white/80 border-b backdrop-blur-2xl border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#FF8C00] rounded-xl flex items-center justify-center shadow-lg shadow-orange-100">
              <span className="text-white font-black text-xl">D</span>
            </div>
            <span className="text-2xl font-black text-[#4B2C20] tracking-tight">
              Del<span className="text-[#FF8C00]">Fod</span>
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {["Beranda", "Populer", "Menu", "Testimoni"].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-bold text-[#4B2C20]/70 hover:text-[#FF8C00] transition-colors"
              >
                {item}
              </a>
            ))}
          </div>
            
          {/* Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 bg-[#FF8C00] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-[#4B2C20] transition-all active:scale-95 shadow-md shadow-gray-100">
            <a href="#contact" className="text-white">
              Chat Us
            </a>
            </button>
            
          <div className="flex items-center gap-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ShoppingCart className="w-6 h-6 text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

            {/* Mobile */}
            <button 
              className="md:hidden text-[#4B2C20]"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden py-6 border-t border-gray-50 animate-in fade-in slide-in-from-top-5">
            <div className="flex flex-col gap-5">
              {["Beranda", "Populer", "Menu", "Testimoni"].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-bold text-[#4B2C20]"
                >
                  {item}
                </a>
              ))}
              <button className="w-full bg-[#FF8C00] text-white py-4 rounded-2xl font-bold shadow-lg shadow-orange-100">
                Chat Us Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}