"use client";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { Star, Quote } from 'lucide-react';
import { useMemo } from 'react';

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
    review: "Absolutely amazing! The food arrived hot and fresh. The delivery was super fast and the quality is unmatched. Will definitely order again!",
    avatar: "SJ"
  },
  {
    id: 2,
    name: "Michael Chen",
    location: "Los Angeles, CA",
    rating: 5,
    review: "Best food delivery service I've ever used. The app is easy to use and the variety of restaurants is incredible. Highly recommended!",
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
    review: "The sushi was incredibly fresh and delicious. Delivery was quick and the driver was very professional. Five stars!",
    avatar: "LA"
  }
];

export default function Testimonials() {
  const settings = useMemo(() => ({
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
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
          slidesToScroll: 1
        }
      }
    ]
  }), []);

  return (
    <section id="testimoni" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Customers Say</h2>
          <p className="text-xl text-muted-foreground">Trusted by thousands of happy customers</p>
        </div>

        <Slider {...settings} className="testimonials-slider">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="px-3">
              <div className="bg-muted rounded-2xl p-6 h-full relative">
                <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary opacity-30" />

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">{testimonial.name}</h4>
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

                <p className="text-foreground leading-relaxed">{testimonial.review}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .testimonials-slider .slick-dots li button:before {
          color: #FF6B35;
        }
        .testimonials-slider .slick-dots li.slick-active button:before {
          color: #FF6B35;
        }
        .testimonials-slider .slick-prev,
        .testimonials-slider .slick-next {
          z-index: 10;
        }
        .testimonials-slider .slick-prev:before,
        .testimonials-slider .slick-next:before {
          color: #FF6B35;
        }
      `}</style>
    </section>
  );
}
