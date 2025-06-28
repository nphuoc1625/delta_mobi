// Script to seed missing categories for products
// Run with: node scripts/seed-categories.js

const sampleCategories = [
    "Headphones",
    "Speakers",
    "Microphones"
];

async function seedCategories() {
    try {
        console.log("🌱 Seeding categories...");

        for (const categoryName of sampleCategories) {
            const response = await fetch('http://localhost:3001/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: categoryName })
            });

            if (response.ok) {
                const createdCategory = await response.json();
                console.log(`✅ Created: ${createdCategory.data.name}`);
            } else {
                const error = await response.json();
                console.log(`❌ Failed to create ${categoryName}:`, error.error);
            }
        }

        console.log("🎉 Category seeding completed!");
    } catch (error) {
        console.error("❌ Error seeding categories:", error);
    }
}

// Run the seeding
seedCategories(); 