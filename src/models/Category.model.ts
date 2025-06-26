import { Schema, models, model, Types } from "mongoose";

const CategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    parent: { type: Types.ObjectId, ref: "ParentCategory", required: true },
});

export default models.Category || model("Category", CategorySchema); 