export interface MenuItem {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  rating?: number;
  gambar: string;
  category?: string;
}

export interface CartItem {
  id: number;
  nama: string;
  harga: number;
  quantity: number;
}
