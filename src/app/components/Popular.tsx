"use client";
import { useState, useEffect } from "react";
import Slider from 'react-slick';
import { Star, Plus } from "lucide-react";
import OrderModal from "./OrderModel";
import type { MenuItem, CartItem } from '../types';
import dynamic from 'next/dynamic';

// Import CSS slick-carousel

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

 interface PopularMenuProps {
  onAddToCart: (item: MenuItem) => void;
}
export default function Popular({ products, onAddToCart }: { products: any[] } & PopularMenuProps) {
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  const handleOrderClick = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  if (!mounted || !products || !products.length) return null;

  // Mengambil tepat 3 item sesuai permintaanmu
  const popularItems = products.slice(0, 3);
 
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
          centerMode: false,
        }
      }
    ]
  };
  const Slider = dynamic(() => import('react-slick'), { ssr: false });
  return (
    <section id="populer" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">Popular Menu</h2>
          <p className="text-xl text-muted-foreground">Our most loved dishes by customers</p>
        </div>

        <Slider {...settings} className="popular-slider">
          {popularItems.map((item) => (
            <div key={item.id} className="px-3">
              {/* Card Style yang disesuaikan dengan referensi layoutmu */}
              <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-xl transition-shadow duration-300 group h-full relative">
                
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/pizzaa.webp";
                    }}
                  />
                  <div className="absolute top-3 left-3 bg-secondary text-foreground rounded-lg px-3 py-1 text-sm font-semibold">
                  {item.kategori}
                  </div>
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
                    <Star className="w-4 h-4 fill-secondary text-secondary" />
                    <span className="text-sm font-semibold">{item.rating}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-foreground mb-1">{item.nama}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-2">
                    {item.deskripsi}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-2xl font-bold text-primary">
                      Rp.{item.harga.toLocaleString('id-ID')}
                    </span>
                    <button
                    onClick={() => onAddToCart(item)}
                      className="bg-primary text-white p-2 rounded-lg hover:bg-[#ff5722] transition-colors"
                    >
                     <div className="flex items-center gap-1">
                       <Plus className="w-5 h-5" /> <p>Beli</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
     {isModalOpen && selectedProduct && (
        <OrderModal 
          onClose={() => setIsModalOpen(false)} 
          product={selectedProduct} 
        />
      )}
      <style jsx global>{`
        /* Menyesuaikan style pagination dots agar sama dengan referensi */
        .popular-slider .slick-dots li button:before {
          color: #FF6B35;
        }
        .popular-slider .slick-dots li.slick-active button:before {
          color: #FF6B35;
        }
        .popular-slider .slick-prev,
        .popular-slider .slick-next {
          z-index: 10;
        }
        .popular-slider .slick-prev:before,
        .popular-slider .slick-next:before {
          color: #FF6B35;
        }
        /* Memastikan card memiliki tinggi yang sama */
        .popular-slider .slick-track {
          display: flex !important;
          gap: 0;
        }
        .popular-slider .slick-slide {
          height: inherit !important;
        }
        .popular-slider .slick-slide > div {
          height: 100%;
        }
      `}</style>
    </section>
  );
}