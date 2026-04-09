import { getProducts } from "@/lib/getProduct";
import Hero from "@/components/Hero";
import Popular from "@/components/Popular";
import ProductList from "@/components/ProductList";
import Testimonials from "@/components/Testimoni";
import Footer from "@/components/Footer";

export default async function Home() {
  const products = await getProducts();

  return (
    <main>
      <Hero />
      <Popular products={products} />
      <ProductList products={products} />
      <Testimonials />
      <Footer />
    </main>
  );
}