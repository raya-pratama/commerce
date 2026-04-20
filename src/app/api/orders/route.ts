import { NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const serviceAccountAuth = new JWT({
  email: GOOGLE_EMAIL,
  key: GOOGLE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SHEET_ID!, serviceAccountAuth);

export async function GET() {
  try {
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Orders']; // Pastikan nama sheet sesuai
    const rows = await sheet.getRows();

    const orders = rows.map(row => ({
      id: row.get('id'),
      nama: row.get('nama'),
      telepon: row.get('telepon'),
      alamat: row.get('alamat'),
      total: parseInt(row.get('total_harga')) || 0,
      tanggal: row.get('tanggal')
    }));

    // Hitung Statistik
    const totalRevenue = orders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = orders.length;

    return NextResponse.json({
      stats: { totalRevenue, totalOrders },
      recentOrders: orders.reverse() // Pesanan terbaru di atas
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Orders'];
    
    await sheet.addRow({
      id: Date.now().toString(),
      nama: body.nama,
      telepon: body.telepon,
      alamat: body.alamat,
      total_harga: body.total_harga.toString(),
      metode: body.metode,
      status: 'Pending',
      tanggal: body.tanggal
    });

    return NextResponse.json({ message: 'Success' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['Orders'] || doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    // Cari baris yang id-nya cocok
    const rowToDelete = rows.find(row => row.get('id') === id);

    if (rowToDelete) {
      await rowToDelete.delete();
      return NextResponse.json({ message: 'Pesanan berhasil dihapus' });
    }

    return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}