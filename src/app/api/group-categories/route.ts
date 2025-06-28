import { NextResponse } from "next/server";
import dbConnect from "@/infrac/mongoose";
import GroupCategory from "@/data/group_category/models/GroupCategory.model";
import { ApiError, handleMongoError, validateRequiredId, validateEntityExists } from "@/core/utils/api-utils";

export async function GET() {
    try {
        await dbConnect();
        const groups = await GroupCategory.find();
        return NextResponse.json(groups);
    } catch (err: any) {
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
        const group = await GroupCategory.create(data);
        return NextResponse.json(group, { status: 201 });
    } catch (err: any) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Group category");
    }
}

export async function PATCH(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id, ...update } = data;

        validateRequiredId(_id, "Group category");

        const group = await GroupCategory.findByIdAndUpdate(_id, update, { new: true });
        validateEntityExists(group, "Group category");

        return NextResponse.json(group);
    } catch (err: any) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return handleMongoError(err, "Group category");
    }
}

export async function DELETE(req: Request) {
    try {
        await dbConnect();
        const data = await req.json();
        const { _id } = data;

        validateRequiredId(_id, "Group category");

        const group = await GroupCategory.findByIdAndDelete(_id);
        validateEntityExists(group, "Group category");

        return NextResponse.json({ success: true });
    } catch (err: any) {
        if (err instanceof ApiError) {
            return NextResponse.json({ error: err.message }, { status: err.statusCode });
        }
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
} 