import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default models.Category || model("Category", CategorySchema); 