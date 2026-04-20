"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      router.push("/admin/products");
      router.refresh(); // Biar middleware nge-cek ulang cookie terbaru
    } else {
      alert("Email atau Password salah!");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-black text-center mb-2">Admin Login</h1>
        <p className="text-gray-400 text-center mb-8">Masukkan akses khusus pengelola.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input required type="email" placeholder="Email" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
            value={email} onChange={(e) => setEmail(e.target.value)} />
          
          <input required type="password" placeholder="Password" className="w-full p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-orange-500" 
            value={password} onChange={(e) => setPassword(e.target.value)} />
          
          <button type="submit" disabled={loading} className="w-full bg-[#FF7043] text-white py-4 rounded-2xl font-black shadow-lg hover:bg-[#f4511e] transition-all">
            {loading ? "MENGECEK..." : "LOGIN SEKARANG"}
          </button>
        </form>
      </div>
    </div>
  );
}