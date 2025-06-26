import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import ParentCategory from "@/models/ParentCategory.model";

export async function GET() {
    await dbConnect();
    const parents = await ParentCategory.find();
    return NextResponse.json(parents);
}

export async function POST(req: Request) {
    await dbConnect();
    const data = await req.json();
    const parent = await ParentCategory.create(data);
    return NextResponse.json(parent, { status: 201 });
}

export async function PATCH(req: Request) {
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    if (!_id) return NextResponse.json({ error: "_id is required" }, { status: 400 });
    const parent = await ParentCategory.findByIdAndUpdate(_id, update, { new: true });
    if (!parent) return NextResponse.json({ error: "ParentCategory not found" }, { status: 404 });
    return NextResponse.json(parent);
} 