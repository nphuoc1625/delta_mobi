// Script to seed sample products for testing
// Run with: node scripts/seed-products.js

const sampleProducts = [
    {
        name: "Delta Sound Pro X1",
        category: "Headphones",
        price: 199.99,
        image: "/window.svg"
    },
    {
        name: "Mobi Mini Speaker",
        category: "Speakers",
        price: 49.99,
        image: "/file.svg"
    },
    {
        name: "Delta Studio Mic",
        category: "Microphones",
        price: 129.99,
        image: "/globe.svg"
    },
    {
        name: "Wireless Earbuds Pro",
        category: "Headphones",
        price: 89.99,
        image: "/next.svg"
    },
    {
        name: "Studio Monitor Speakers",
        category: "Speakers",
        price: 299.99,
        image: "/vercel.svg"
    },
    {
        name: "Professional Condenser Mic",
        category: "Microphones",
        price: 199.99,
        image: "/window.svg"
    }
];

async function seedProducts() {
    try {
        console.log("🌱 Seeding products...");

        for (const product of sampleProducts) {
            const response = await fetch('http://localhost:3001/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product)
            });

            if (response.ok) {
                const createdProduct = await response.json();
                console.log(`✅ Created: ${createdProduct.name}`);
            } else {
                const error = await response.json();
                console.log(`❌ Failed to create ${product.name}:`, error.error);
            }
        }

        console.log("🎉 Product seeding completed!");
    } catch (error) {
        console.error("❌ Error seeding products:", error);
    }
}

// Run the seeding
seedProducts(); 