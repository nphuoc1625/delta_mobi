import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import Category from "@/data/category/models/Category.model";
import GroupCategory from "@/data/group_category/models/GroupCategory.model";
import { validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { handleCategoryError, validateCategoryData } from "./errors";

export async function GET(req: Request) {
    console.log("🔍 [CATEGORIES API] GET request received");
    try {
        console.log("🔌 [CATEGORIES API] Connecting to database...");
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';

        console.log("📊 [CATEGORIES API] Fetching categories with filters:", { page, limit, search, sort, order });

        // Build query
        const query: Record<string, unknown> = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        // Build sort
        const sortObj: Record<string, 1 | -1> = {};
        sortObj[sort] = order === 'asc' ? 1 : -1;

        // Execute query with pagination
        const skip = (page - 1) * limit;
        const categories = await Category.find(query)
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        const total = await Category.countDocuments(query);
        const pages = Math.ceil(total / limit);

        console.log(`✅ [CATEGORIES API] Found ${categories.length} categories (page ${page}/${pages})`);

        return NextResponse.json({
            success: true,
            data: {
                categories,
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            }
        });
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

        return NextResponse.json({
            success: true,
            data: category
        }, { status: 201 });
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

        return NextResponse.json({
            success: true,
            data: category
        });
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
        const { _id, confirmed } = data;
        console.log("🗑️ [CATEGORIES API] Deleting category with ID:", _id, "Confirmed:", confirmed);

        validateRequiredId(_id, "Category");

        const category = await Category.findById(_id);
        validateEntityExists(category, "Category");

        // Check if deletion is confirmed
        if (!confirmed) {
            // Return warning information without deleting
            const affectedGroupCategories = await GroupCategory.find({ categories: _id });
            const affectedGroupCategoryNames = affectedGroupCategories.map(gc => gc.name);

            // TODO: Check for affected products when Product model is available
            const affectedProducts = 0; // Placeholder
            const productNames: string[] = []; // Placeholder

            console.log("⚠️ [CATEGORIES API] Deletion not confirmed, returning warning info");

            return NextResponse.json({
                success: true,
                data: {
                    category: {
                        _id: category._id,
                        name: category.name
                    },
                    warnings: {
                        affectedProducts,
                        affectedGroupCategories: affectedGroupCategories.length,
                        productNames,
                        groupCategoryNames: affectedGroupCategoryNames
                    }
                }
            });
        }

        // If confirmed, proceed with deletion
        console.log("✅ [CATEGORIES API] Deletion confirmed, proceeding...");

        // Remove category from all group categories
        const updateResult = await GroupCategory.updateMany(
            { categories: _id },
            { $pull: { categories: _id } }
        );

        console.log(`🔄 [CATEGORIES API] Removed category from ${updateResult.modifiedCount} group categories`);

        // TODO: Remove category from all products when Product model is available

        // Delete the category
        const deletedCategory = await Category.findByIdAndDelete(_id);

        console.log("✅ [CATEGORIES API] Category deleted successfully:", deletedCategory);

        return NextResponse.json({
            success: true,
            data: {
                message: "Category deleted successfully",
                category: deletedCategory
            }
        });
    } catch (err: unknown) {
        return handleCategoryError(err);
    }
} 