import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import GroupCategory from "@/data/group_category/models/GroupCategory.model";
import { ApiError, validateRequiredId, validateEntityExists } from "@/core/errors/ApiError";
import { ErrorCodes } from "@/core/errors/errorCodes";
import { handleGroupCategoryError, validateGroupCategoryData } from "./errors";

export async function GET() {
    console.log("🔍 [GROUP CATEGORIES API] GET request received");
    try {
        console.log("🔌 [GROUP CATEGORIES API] Connecting to database...");
        await dbConnect();
        console.log("📊 [GROUP CATEGORIES API] Fetching all group categories...");
        const groups = await GroupCategory.find();
        console.log(`✅ [GROUP CATEGORIES API] Found ${groups.length} group categories`);
        return NextResponse.json(groups);
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
        return NextResponse.json(group, { status: 201 });
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
        return NextResponse.json(group);
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
            message: "Group category deleted successfully",
            code: "GROUP_CATEGORY_DELETE_SUCCESS",
            timestamp: new Date().toISOString()
        });
    } catch (err: unknown) {
        console.error("❌ [GROUP CATEGORIES API] DELETE error:", err);
        return handleGroupCategoryError(err);
    }
} 