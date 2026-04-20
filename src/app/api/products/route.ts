import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { NextResponse } from 'next/server';
import Papa from 'papaparse';
import { v2 as cloudinary } from "cloudinary";

const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjiljD7H8GZbDskFKcZ1v9UTCSq8B2YmqcDW6j2flxEFag5MfjVEb91b3sO-OaYJKD-q3DhaHLHBS6/pub?gid=0&single=true&output=csv";

// Konfigurasi Auth (Untuk POST)
// Ganti bagian konfigurasi Auth kamu jadi seperti ini
// Di dalam route.ts
const serviceAccountAuth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
  // Kode ini wajib ada untuk mengubah teks \n menjadi enter asli
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'), 
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID!, serviceAccountAuth);

// --- GET: Pakai CSV (Stabil & Cepat) ---
// Di dalam src/app/api/products/route.ts

export async function GET() {
  try {
    const response = await fetch(SHEET_CSV_URL, { 
      cache: 'no-store',
      next: { revalidate: 0 } 
    });
    const csvData = await response.text();

    const parsedData = Papa.parse(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    // SESUAIKAN DENGAN KOLOM DI SPREADSHEET KAMU
    const cleanData = parsedData.data.map((row: any) => ({
      id: row.id || '',
      name: row.produk || '',      // 'produk' di Sheets -> 'name' di UI
      category: row.kategori || '', // 'kategori' di Sheets -> 'category' di UI
      price: row.harga ? String(row.harga).replace(/\D/g, '') : '0', // 'harga' di Sheets
      image: row.gambar || '',     // 'gambar' di Sheets -> 'image' di UI
      stock: row.stok || '0',       // Jika di Sheets belum ada kolom 'stok', ini akan jadi 0
      rating: row.rating || '5'
    }));

    return NextResponse.json(cleanData);
  } catch (error: any) {
    return NextResponse.json({ error: "Gagal baca CSV: " + error.message }, { status: 500 });
  }
}

// --- POST: Pakai Service Account (Untuk Menulis) ---
// Di dalam POST (src/app/api/products/route.ts)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Data masuk ke API:", body); // Cek ini di terminal VS Code

    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();
    
    // Pastikan kunci (key) di bawah ini SAMA PERSIS dengan header di Google Sheets kamu
    await sheet.addRow({
      id: (rows.length + 1).toString(),
      produk: body.produk || "-",    // Pakai body.produk (sesuai form frontend)
      kategori: body.kategori || "-",
      harga: (body.harga || 0).toString(),
      stok: (body.stok || 0).toString(),
      gambar: body.gambar || "",
      deskripsi: body.deskripsi || "-",
      rating: "5"
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error: any) {
    console.error("Error API POST:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Tambahkan di dalam file src/app/api/products/route.ts

// --- FITUR EDIT ---
export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Cari baris yang ID-nya cocok
    const rowToUpdate = rows.find(row => row.get('id') === body.id);

    if (rowToUpdate) {
      rowToUpdate.set('produk', body.produk);
      rowToUpdate.set('kategori', body.kategori);
      rowToUpdate.set('harga', body.harga.toString());
      rowToUpdate.set('stok', body.stok.toString());
      rowToUpdate.set('gambar', body.gambar);
      rowToUpdate.set('deskripsi', body.deskripsi);
      await rowToUpdate.save();
      return NextResponse.json({ message: 'Update Berhasil' });
    }
    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// src/app/api/products/route.ts

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // 1. Cari baris berdasarkan ID
    const rowToDelete = rows.find(row => row.get('id') === id);

    if (rowToDelete) {
      const imageUrl = rowToDelete.get('gambar');

      // 2. Logika Hapus Foto di Cloudinary
      // Contoh URL: https://res.cloudinary.com/cloudname/image/upload/v123/products/foto_abc.jpg
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        try {
          // Ambil bagian setelah 'upload/'
          const parts = imageUrl.split('/');
          const uploadIndex = parts.indexOf('upload');
          
          // Ambil path setelah versi (v1234567)
          // Hasilnya: "products/foto_abc.jpg"
          const fullPath = parts.slice(uploadIndex + 2).join('/');
          
          // Hilangkan ekstensi file (.jpg / .png)
          // Hasilnya: "products/foto_abc" (Ini adalah Public ID)
          const publicId = fullPath.split('.')[0];

          await cloudinary.uploader.destroy(publicId);
          console.log("Berhasil menghapus foto di Cloudinary:", publicId);
        } catch (err) {
          console.error("Gagal menghapus foto di Cloudinary:", err);
        }
      }

      // 3. Hapus baris di Google Sheets
      await rowToDelete.delete();
      
      return NextResponse.json({ message: 'Produk dan Foto Berhasil Dihapus' });
    }

    return NextResponse.json({ error: 'Produk tidak ditemukan' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}