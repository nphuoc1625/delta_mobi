import Image from "next/image";
import Header from "../components/Header";
import Footer from "../components/Footer";

const featuredProducts = [
  {
    id: 1,
    name: "Delta Sound Pro X1",
    description: "High-fidelity wireless headphones with noise cancellation.",
    price: "$199",
    image: "/window.svg",
  },
  {
    id: 2,
    name: "Mobi Mini Speaker",
    description: "Portable Bluetooth speaker with deep bass.",
    price: "$49",
    image: "/file.svg",
  },
  {
    id: 3,
    name: "Delta Studio Mic",
    description: "Professional USB microphone for studio-quality sound.",
    price: "$129",
    image: "/globe.svg",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-white">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center flex-1 py-16 px-4 text-center bg-gradient-to-b from-gray-950/90 to-gray-900/80">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 text-blue-400 drop-shadow-lg">Premium Sound Devices</h1>
        <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-2xl">Experience the next level of audio with Delta Mobi. Explore our curated selection of headphones, speakers, and studio equipment designed for true sound lovers.</p>
        <div className="flex flex-wrap gap-4 justify-center">
          <a href="/products" className="px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-lg font-semibold shadow-lg transition">Browse Products</a>
          <a href="#about" className="px-8 py-3 rounded-full bg-gray-800 hover:bg-gray-700 text-lg font-semibold shadow-lg transition">Learn More</a>
        </div>
      </section>

      {/* Featured Products */}
      <main id="products" className="w-full max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold mb-10 text-center text-blue-300">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-gray-900 rounded-2xl p-8 flex flex-col items-center shadow-xl hover:scale-105 hover:shadow-blue-900 transition-transform border border-gray-800">
              <Image
                src={product.image}
                alt={product.name}
                width={72}
                height={72}
                className="mb-6"
              />
              <h3 className="text-xl font-bold mb-2 text-white">{product.name}</h3>
              <p className="text-base text-gray-400 mb-4 text-center">{product.description}</p>
              <span className="text-lg font-semibold text-blue-400">{product.price}</span>
              <button className="mt-6 px-6 py-2 rounded-full bg-blue-600 hover:bg-blue-700 font-semibold transition shadow">View Details</button>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
