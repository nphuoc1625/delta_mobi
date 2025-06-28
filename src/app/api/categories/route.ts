import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import Category from "@/data/category/models/Category.model";
import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/core/utils/api-utils";

export async function GET() {
    try {
        await dbConnect();
        const categories = await Category.find();
        return NextResponse.json(categories);
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
        const category = await Category.create(data);
        return NextResponse.json(category, { status: 201 });
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Category");
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;

        validateRequiredId(_id, "Category");

        const category = await Category.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(category, "Category");

        return NextResponse.json(category);
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Category");
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id } = data;

        validateRequiredId(_id, "Category");

        const category = await Category.findByIdAndDelete(_id);
        validateEntityExists(category, "Category");

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 