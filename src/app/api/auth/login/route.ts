import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Ambil data dari .env
    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (email === validEmail && password === validPassword) {
      const response = NextResponse.json({ message: "Login Berhasil" });

      // Set Cookie agar browser ingat kita sudah login
      // Kita pakai cookie sederhana 'isLoggedIn=true'
      response.cookies.set("admin_token", "authorized", {
        httpOnly: true, // Lebih aman, gak bisa dicolong script JS
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24, // Berlaku 1 hari
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Email atau Password Salah!" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
  }
}