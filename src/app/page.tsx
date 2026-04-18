// import { getProducts } from "@/lib/getProduct";
// import Hero from "@/app/components/Hero";
// import Popular from "@/app/components/Popular";
// import ProductList from "@/app/components/ProductList";
// import Testimonials from "@/app/components/Testimoni";
// import Footer from "@/app/components/Footer";
// export const dynamic = 'force-dynamic';
// export const revalidate = 0;
// export default async function Home() {
//   const products = await getProducts();

//   return (
//     <main>
//       <Hero />
//       <Popular products={products} />
//       <ProductList products={products} />
//       <Testimonials />
//       <Footer />
//     </main>
//   );
// }

"use client";


import { useState, useEffect } from 'react';
import { getProducts } from "@/lib/getProduct";
import Navbar from "@/app/components/Navbar";
import Hero from "@/app/components/Hero";
import Popular from "@/app/components/Popular";
import ProductList from "@/app/components/ProductList";
import Testimonials from "@/app/components/Testimoni";
import Footer from "@/app/components/Footer";
import { AddToCartModal } from './components/AddToCartModal';
import { ShoppingCartOverlay } from './components/ShoppingCartOverlay';
import { OrderConfirmationModal } from '@/app/components/OrderConfirmationModal';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import type { MenuItem, CartItem } from './types';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isAddToCartModalOpen, setIsAddToCartModalOpen] = useState(false);
  const [isCartOverlayOpen, setIsCartOverlayOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Gagal mengambil produk:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    setIsAddToCartModalOpen(true);
  };

  const handleConfirmAddToCart = (quantity: number) => {
    if (!selectedItem) return;

    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === selectedItem.id);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === selectedItem.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      
      return [...prevItems, { 
        id: selectedItem.id,
        nama: selectedItem.nama,
        harga: selectedItem.harga,
        quantity 
      }];
    });

    toast.success(`${selectedItem.nama} ditambahkan ke keranjang!`, {
      description: `${quantity}x - Rp ${(selectedItem.harga * quantity * 1000).toLocaleString('id-ID')}`,
      duration: 2000,
    });
  };

  const handleRemoveItem = (id: number) => {
    const item = cartItems.find(i => i.id === id);
    setCartItems(prevItems => prevItems.filter(i => i.id !== id));
    
    if (item) {
      toast.success('Item dihapus dari keranjang', {
        description: item.nama,
      });
    }
  };
  const handleUpdateQuantity = (id: number, newQuantity: number) => {
  setCartItems(prev => 
    prev.map(item => item.id === id ? { ...item, quantity: newQuantity } : item)
  );
};
  const handleCartClick = () => {
    if (cartItems.length === 0) {
      toast.error('Keranjang masih kosong', {
        description: 'Silakan pilih menu terlebih dahulu',
      });
      return;
    }
    setIsCartOverlayOpen(true);
  };

  const handleCheckout = () => {
    setIsCheckoutModalOpen(true);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors />
      <Navbar cartCount={cartCount} onCartClick={handleCartClick} />
      <main>
        <Hero />
        <Popular onAddToCart={handleItemClick}  products={products} />
        <ProductList onAddToCart={handleItemClick}  products={products} />
        <Testimonials />
      </main>
      <Footer />
      
      {/* Add to Cart Modal */}
      <AddToCartModal
        isOpen={isAddToCartModalOpen}
        onClose={() => setIsAddToCartModalOpen(false)}
        item={selectedItem}
        onConfirm={handleConfirmAddToCart}
      />

      {/* Shopping Cart Overlay */}
      <ShoppingCartOverlay
        isOpen={isCartOverlayOpen}
        onClose={() => setIsCartOverlayOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveItem}
        onUpdateQuantity={handleUpdateQuantity} // Kirim fungsinya di sini
        onCheckout={handleCheckout}     
         />

      {/* Order Confirmation Modal */}
     <OrderConfirmationModal 
    isOpen={isCheckoutModalOpen} 
    onClose={() => setIsCheckoutModalOpen(false)} 
    items={cartItems}
    />
    </div>
  );
}