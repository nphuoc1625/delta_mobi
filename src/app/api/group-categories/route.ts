import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import GroupCategory from "@/data/group_category/models/GroupCategory.model";
import { validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { handleGroupCategoryError, validateGroupCategoryData } from "./errors";

export async function GET(req: Request) {
    console.log("🔍 [GROUP CATEGORIES API] GET request received");
    try {
        console.log("🔌 [GROUP CATEGORIES API] Connecting to database...");
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
        const search = searchParams.get('search') || '';
        const sort = searchParams.get('sort') || 'createdAt';
        const order = searchParams.get('order') || 'desc';

        console.log("📊 [GROUP CATEGORIES API] Fetching group categories with filters:", { page, limit, search, sort, order });

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
        const groupCategories = await GroupCategory.find(query)
            .populate('categories', 'name')
            .sort(sortObj)
            .skip(skip)
            .limit(limit);

        const total = await GroupCategory.countDocuments(query);
        const pages = Math.ceil(total / limit);

        console.log(`✅ [GROUP CATEGORIES API] Found ${groupCategories.length} group categories (page ${page}/${pages})`);

        return NextResponse.json({
            success: true,
            data: {
                groupCategories,
                pagination: {
                    page,
                    limit,
                    total,
                    pages
                }
            }
        });
    } catch (err: unknown) {
        console.error("❌ [GROUP CATEGORIES API] GET error:", err);
        return handleGroupCategoryError(err);
    }
}

export async function POST(req: Request) {
    console.log("➕ [GROUP CATEGORIES API] POST request received");
    try {
        console.log("🔌 [GROUP CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        console.log("📝 [GROUP CATEGORIES API] Creating group category with data:", data);

        // Validate group category data
        validateGroupCategoryData(data);

        const group = await GroupCategory.create(data);
        console.log("✅ [GROUP CATEGORIES API] Group category created successfully:", group);

        return NextResponse.json({
            success: true,
            data: group
        }, { status: 201 });
    } catch (err: unknown) {
        console.error("❌ [GROUP CATEGORIES API] POST error:", err);
        return handleGroupCategoryError(err);
    }
}

export async function PATCH(req: Request) {
    console.log("✏️ [GROUP CATEGORIES API] PATCH request received");
    try {
        console.log("🔌 [GROUP CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;
        console.log("🔄 [GROUP CATEGORIES API] Updating group category:", { _id, update });

        validateRequiredId(_id, "Group Category");
        validateGroupCategoryData(update);

        const group = await GroupCategory.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(group, "Group Category");

        console.log("✅ [GROUP CATEGORIES API] Group category updated successfully:", group);

        return NextResponse.json({
            success: true,
            data: group
        });
    } catch (err: unknown) {
        console.error("❌ [GROUP CATEGORIES API] PATCH error:", err);
        return handleGroupCategoryError(err);
    }
}

export async function DELETE(req: Request) {
    console.log("🗑️ [GROUP CATEGORIES API] DELETE request received");
    try {
        console.log("🔌 [GROUP CATEGORIES API] Connecting to database...");
        await dbConnect();
        const data = await req.json();
        const { _id } = data;
        console.log("🗑️ [GROUP CATEGORIES API] Deleting group category with ID:", _id);

        validateRequiredId(_id, "Group Category");

        const group = await GroupCategory.findByIdAndDelete(_id);
        validateEntityExists(group, "Group Category");

        console.log("✅ [GROUP CATEGORIES API] Group category deleted successfully:", group);

        return NextResponse.json({
            success: true,
            data: {
                message: "Group category deleted successfully",
                group: group
            }
        });
    } catch (err: unknown) {
        console.error("❌ [GROUP CATEGORIES API] DELETE error:", err);
        return handleGroupCategoryError(err);
    }
} 