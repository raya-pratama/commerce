"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, LayoutDashboard, UtensilsCrossed } from "lucide-react";

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, path: "/admin" },
    { name: "Product Management", icon: <UtensilsCrossed />, path: "/admin/products" },
  ];

  return (
    <>
      {/* Overlay: Muncul saat sidebar dibuka di HP */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 h-full bg-[#3E2723] text-white z-50 transition-transform duration-300 w-72
        ${isOpen ? "translate-x-0" : "-translate-x-full"} 
        lg:translate-x-0 
      `}>
        <div className="p-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-2xl font-black flex items-center gap-2">
                Food<span className="text-orange-500">Admin</span>
              </h1>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Management Portal</p>
            </div>
            {/* Tombol Close hanya muncul di HP */}
            <button onClick={onClose} className="lg:hidden p-2 hover:bg-white/10 rounded-xl">
              <X className="w-6 h-6" />
            </button>
          </div>

          <nav className="space-y-3">
            {menuItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => onClose()} // Tutup sidebar setelah klik menu di HP
                className={`flex items-center gap-4 p-4 rounded-2xl font-bold transition-all ${
                  pathname === item.path ? "bg-orange-500 text-white shadow-lg shadow-orange-900/20" : "text-gray-400 hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}