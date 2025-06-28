import { Schema, models, model, Types } from "mongoose";

const GroupCategorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    categories: [{ type: Types.ObjectId, ref: "Category" }],
});

export default models.GroupCategory || model("GroupCategory", GroupCategorySchema); 