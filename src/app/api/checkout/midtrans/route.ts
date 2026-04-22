import Midtrans from 'midtrans-client';
import { NextResponse } from 'next/server';

// 1. Definisikan tipe data agar TypeScript senang
interface CheckoutRequest {
  metode: 'pickup' | 'delivery';
  nama: string;
  telepon: string;
  total_harga: number;
  items: Array<{
    id: string | number;
    nama: string;
    harga: number;
    quantity: number;
  }>;
}

// 2. Inisialisasi Midtrans Snap
const snap = new Midtrans.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || ''
});

export async function POST(req: Request) {
  try {
    const body: CheckoutRequest = await req.json();

    // 3. Validasi dasar
    if (!body.total_harga || !body.nama || !body.items) {
      return NextResponse.json({ error: "Data pesanan tidak lengkap" }, { status: 400 });
    }

    // 4. Susun item_details (Kunci utama agar tidak error 400)
    // Map item dari keranjang belanja
    const item_details = body.items.map(item => ({
      id: String(item.id),
      price: item.harga,
      quantity: item.quantity,
      name: item.nama.substring(0, 50) // Midtrans batasi nama item max 50 karakter
    }));

    // Tambahkan Ongkos Kirim jika metodenya delivery
    // Nominal 2000 ini harus sama persis dengan yang ada di OrderConfirmationModal
    if (body.metode === 'delivery') {
      item_details.push({
        id: 'SHIPPING_FEE',
        price: 2000,
        quantity: 1,
        name: 'Ongkos Kirim'
      });
    }

    // 5. Susun Parameter Transaksi
    const parameter = {
      transaction_details: {
        // Order ID unik agar tidak bentrok di dashboard Midtrans
        order_id: `FOOD-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        gross_amount: body.total_harga, 
      },
      customer_details: {
        first_name: body.nama,
        phone: body.telepon,
      },
      item_details: item_details, // Gunakan array yang sudah kita buat di atas
      usage_limit: 1 // Opsional: membatasi transaksi hanya bisa dibayar 1x
    };

    // 6. Buat Transaksi ke Midtrans
    const transaction = await snap.createTransaction(parameter);
    
    return NextResponse.json({ 
      token: transaction.token,
      redirect_url: transaction.redirect_url 
    });

  } catch (error: any) {
    console.error("Midtrans Error Detail:", error);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan pada server Midtrans" }, 
      { status: 500 }
    );
  }
}