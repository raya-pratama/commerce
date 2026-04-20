"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", path: "/admin", icon: "M4 13h6a1 1 0 001-1V4a1 1 0 00-1-1H4a1 1 0 00-1 1v8a1 1 0 001 1zm0 8h6a1 1 0 001-1v-4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1zm10-10h6a1 1 0 001-1V4a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1zm0 10h6a1 1 0 001-1v-6a1 1 0 00-1-1h-6a1 1 0 00-1 1v6a1 1 0 001 1z" },
    { name: "Product Management", path: "/admin/products", icon: "M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" },
  ];

  return (
    <aside className="w-64 bg-[#3E2723] min-h-screen p-6 flex flex-col fixed">
      <div className="mb-12">
        <h1 className="text-3xl font-black text-white">Food<span className="text-[#FF7043]">Admin</span></h1>
        <p className="text-[#A1887F] text-xs">Management Portal</p>
      </div>
      <nav className="space-y-3">
        {menu.map((item) => (
          <Link key={item.path} href={item.path}
            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${pathname === item.path ? 'bg-[#FF7043] text-white shadow-lg' : 'text-[#D7CCC8] hover:bg-[#5D4037]'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}