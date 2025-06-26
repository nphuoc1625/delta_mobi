import { Schema, models, model } from "mongoose";

const ParentCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
});

export default models.ParentCategory || model("ParentCategory", ParentCategorySchema); 