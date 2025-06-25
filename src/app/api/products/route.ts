import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";

export async function GET() {
    await dbConnect();
    const products = await Product.find();
    return NextResponse.json(products);
} 