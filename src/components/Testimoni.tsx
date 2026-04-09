// src/components/Testimonials.tsx
const reviews = [
  { name: "Andi", text: "Basrengnya juara banget, pedasnya pas!", stars: 5 },
  { name: "Budi", text: "Pengiriman cepat dan packing aman. Mantap.", stars: 5 },
  { name: "Siti", text: "Cokelat lumer di browniesnya enak pol!", stars: 4 },
];

export default function Testimonials() {
  return (
    <section className="bg-orange-50 py-20 px-6">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#4B2C20] mb-12">Kata Mereka</h2>
        {/* Grid: 1 di HP, 3 di Laptop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-orange-100">
              <p className="italic text-gray-600">"{rev.text}"</p>
              <h4 className="mt-4 font-bold text-[#4B2C20]">- {rev.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}