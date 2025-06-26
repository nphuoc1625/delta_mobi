import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Category from "@/models/Category.model";

export async function GET() {
    await dbConnect();
    const categories = await Category.find().populate('parent');
    return NextResponse.json(categories);
}

export async function POST(req: Request) {
    await dbConnect();
    const data = await req.json();
    const category = await Category.create(data);
    return NextResponse.json(category, { status: 201 });
}

export async function PATCH(req: Request) {
    await dbConnect();
    const data = await req.json();
    const { _id, ...update } = data;
    if (!_id) return NextResponse.json({ error: "_id is required" }, { status: 400 });
    const category = await Category.findByIdAndUpdate(_id, update, { new: true }).populate('parent');
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json(category);
} 