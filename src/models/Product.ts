import mongoose, { Schema, models, model } from "mongoose";

const ProductSchema = new Schema({
    name: String,
    category: String,
    price: Number,
    image: String,
});

export default models.Product || model("Product", ProductSchema); 