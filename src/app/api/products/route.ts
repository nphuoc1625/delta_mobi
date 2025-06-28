import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import Product from "@/data/product/models/Product.model";
import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/core/utils/api-utils";

export async function GET(request: Request) {
    try {
        await dbConnect();

        // Parse query parameters
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const category = searchParams.get('category');

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

        const products = await Product.find(query);
        return NextResponse.json(products);
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const product = await Product.create(data);
        return NextResponse.json(product, { status: 201 });
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Product");
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;

        validateRequiredId(_id, "Product");

        const product = await Product.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(product, "Product");

        return NextResponse.json(product);
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Product");
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id } = data;

        validateRequiredId(_id, "Product");

        const product = await Product.findByIdAndDelete(_id);
        validateEntityExists(product, "Product");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 