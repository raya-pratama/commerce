"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  review: string;
  avatar: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    location: "New York, NY",
    rating: 5,
    review: "Absolutely amazing! The food arrived hot and fresh. The delivery was super fast and the quality is unmatched.",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    review: "Best food delivery service I've ever used. The app is easy to use and the variety of restaurants is incredible.",
    avatar: "MC"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    location: "Chicago, IL",
    rating: 4,
    review: "Great experience overall! Food quality is excellent and prices are reasonable. The customer service team is very responsive.",
    avatar: "ER"
  },
  {
    id: 4,
    name: "David Thompson",
    location: "Houston, TX",
    rating: 5,
    review: "I order from FoodExpress almost every week. Never disappoints! The packaging is eco-friendly too which is a huge plus.",
    avatar: "DT"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    location: "Phoenix, AZ",
    rating: 5,
    review: "The sushi was incredibly fresh and delicious. Delivery was quick and the driver was very professional.",
    avatar: "LA"
  }
];

export default function Testimonials() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="testimoni" className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground">Trusted by thousands of happy customers</p>
        </div>

        {/* --- NATIVE SCROLL SNAP --- */}
        <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory scrollbar-hide pb-10 px-2">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id} 
              className="min-w-[85%] sm:min-w-[calc(50%-12px)] lg:min-w-[calc(33.333%-16px)] snap-center"
            >
              <div className="bg-muted rounded-2xl p-6 h-full relative border border-transparent hover:border-primary/20 transition-all duration-300">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary opacity-30" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold shrink-0">
                    {testimonial.avatar}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground truncate">{testimonial.name}</h4>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating
                          ? 'fill-secondary text-secondary'
                          : 'text-gray-300'
                        }`}
                    />
                  ))}
                </div>

                <p className="text-foreground leading-relaxed italic">
                  &quot;{testimonial.review}&quot;
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}