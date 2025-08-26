import { NextResponse } from "next/server";
import dbConnect from "@/infrastructure/mongodb/mongoose";
import Product from "@/infrastructure/mongodb/tables/Product.model";
import { validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { handleProductError, validateProductData } from "./errors";

export async function GET(request: Request) {
    console.log("🔍 [PRODUCTS API] GET request received");
    try {
        console.log("🔌 [PRODUCTS API] Connecting to database...");
        await dbConnect();

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const sortBy = searchParams.get('sortBy') || 'name';
        const sortOrder = searchParams.get('sortOrder') || 'asc';

        // Build query object
        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        // Calculate pagination
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments(query);
        const totalPages = Math.ceil(total / limit);

        // Execute query with pagination
        const products = await Product.find(query)
            .sort({ [sortBy]: sortOrder === 'asc' ? 1 : -1 })
            .skip(skip)
            .limit(limit);

        console.log(`✅ [PRODUCTS API] Found ${products.length} products`);

        // Return paginated response
        return NextResponse.json({
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    } catch (err: unknown) {
        console.error("❌ [PRODUCTS API] GET error:", err);
        return handleProductError(err);
    }
}

export async function POST(req: Request) {
    console.log("➕ [PRODUCTS API] POST request received");
    try {
        console.log("🔌 [PRODUCTS API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        console.log("📝 [PRODUCTS API] Creating product with data:", data);

        // Validate product data
        validateProductData(data);

        const product = await Product.create(data);
        console.log("✅ [PRODUCTS API] Product created successfully:", product);
        return NextResponse.json(product, { status: 201 });
    } catch (err: unknown) {
        console.error("❌ [PRODUCTS API] POST error:", err);
        return handleProductError(err);
    }
}

export async function PATCH(req: Request) {
    console.log("✏️ [PRODUCTS API] PATCH request received");
    try {
        console.log("🔌 [PRODUCTS API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;
        console.log("🔄 [PRODUCTS API] Updating product:", { _id, update });

        validateRequiredId(_id, "Product");
        validateProductData(update);

        const product = await Product.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(product, "Product");

        console.log("✅ [PRODUCTS API] Product updated successfully:", product);
        return NextResponse.json(product);
    } catch (err: unknown) {
        console.error("❌ [PRODUCTS API] PATCH error:", err);
        return handleProductError(err);
    }
}

// Helper function to delete product image file
async function deleteProductImage(imageUrl: string): Promise<void> {
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
        return; // Skip if not a local upload
    }

    try {
        const { unlink } = await import('fs/promises');
        const { join } = await import('path');
        const { existsSync } = await import('fs');

        const uploadsDir = join(process.cwd(), 'public', 'uploads');
        const fileName = imageUrl.split('/').pop();
        const imagePath = join(uploadsDir, fileName!);

        if (existsSync(imagePath)) {
            await unlink(imagePath);
            console.log(`🗑️ [PRODUCTS API] Deleted product image: ${fileName}`);
        }
    } catch (error) {
        console.error(`❌ [PRODUCTS API] Failed to delete product image: ${imageUrl}`, error);
        // Don't throw error - image deletion failure shouldn't prevent product deletion
    }
}

export async function DELETE(req: Request) {
    console.log("🗑️ [PRODUCTS API] DELETE request received");
    try {
        console.log("🔌 [PRODUCTS API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id } = data;
        console.log("🗑️ [PRODUCTS API] Deleting product with ID:", _id);

        validateRequiredId(_id, "Product");

        const product = await Product.findByIdAndDelete(_id);
        validateEntityExists(product, "Product");

        console.log("✅ [PRODUCTS API] Product deleted successfully:", product);
        // Delete the product image file if it exists
        if (product.image) {
            await deleteProductImage(product.image);
        }
        return NextResponse.json({
            success: true,
            message: "Product deleted successfully",
            code: "PRODUCT_DELETE_SUCCESS",
            timestamp: new Date().toISOString()
        });
    } catch (err: unknown) {
        console.error("❌ [PRODUCTS API] DELETE error:", err);
        return handleProductError(err);
    }
} 