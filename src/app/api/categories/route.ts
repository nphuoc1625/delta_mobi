import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import Category from "@/data/category/models/Category.model";
import { ApiError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { handleCategoryError, validateCategoryData } from "./errors";

export async function GET() {
    console.log("🔍 [CATEGORIES API] GET request received");
    try {
        console.log("🔌 [CATEGORIES API] Connecting to database...");
        await dbConnect();
        console.log("📊 [CATEGORIES API] Fetching all categories...");
        const categories = await Category.find();
        console.log(`✅ [CATEGORIES API] Found ${categories.length} categories`);
        return NextResponse.json(categories);
    } catch (err: unknown) {
        return handleCategoryError(err);
    }
}

export async function POST(req: Request) {
    console.log("➕ [CATEGORIES API] POST request received");
    try {
        console.log("🔌 [CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        console.log("📝 [CATEGORIES API] Creating category with data:", data);

        // Validate category data
        validateCategoryData(data);

        const category = await Category.create(data);
        console.log("✅ [CATEGORIES API] Category created successfully:", category);
        return NextResponse.json(category, { status: 201 });
    } catch (err: unknown) {
        return handleCategoryError(err);
    }
}

export async function PATCH(req: Request) {
    console.log("✏️ [CATEGORIES API] PATCH request received");
    try {
        console.log("🔌 [CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;
        console.log("🔄 [CATEGORIES API] Updating category:", { _id, update });

        validateRequiredId(_id, "Category");
        validateCategoryData(update);

        const category = await Category.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(category, "Category");

        console.log("✅ [CATEGORIES API] Category updated successfully:", category);
        return NextResponse.json(category);
    } catch (err: unknown) {
        return handleCategoryError(err);
    }
}

export async function DELETE(req: Request) {
    console.log("🗑️ [CATEGORIES API] DELETE request received");
    try {
        console.log("🔌 [CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id } = data;
        console.log("🗑️ [CATEGORIES API] Deleting category with ID:", _id);

        validateRequiredId(_id, "Category");

        const category = await Category.findByIdAndDelete(_id);
        validateEntityExists(category, "Category");

        console.log("✅ [CATEGORIES API] Category deleted successfully:", category);
        return NextResponse.json({
            success: true,
            message: "Category deleted successfully",
            code: "CATEGORY_DELETE_SUCCESS",
            timestamp: new Date().toISOString()
        });
    } catch (err: unknown) {
        return handleCategoryError(err);
    }
} 