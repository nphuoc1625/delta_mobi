import { Schema, models, model, Types } from "mongoose";

const GroupCategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 100,
        validate: {
            validator: function (v: string) {
                // Allow alphanumeric characters, spaces, hyphens, underscores
                return /^[a-zA-Z0-9\s\-_]+$/.test(v);
            },
            message: 'Name can only contain alphanumeric characters, spaces, hyphens, and underscores'
        }
    },
    categories: [{
        type: Types.ObjectId,
        ref: "Category",
        validate: {
            validator: function (v: Types.ObjectId[]) {
                // Categories array is optional, but if provided, must contain valid ObjectIds
                return v.length === 0 || v.every(id => Types.ObjectId.isValid(id));
            },
            message: 'Categories must contain valid ObjectIds'
        }
    }]
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'group_categories'
});

// Create case-insensitive unique index
GroupCategorySchema.index({ name: 1 }, {
    unique: true,
    collation: { locale: "en", strength: 2 }
});

// Create index on categories for lookups
GroupCategorySchema.index({ categories: 1 });

// Create index on createdAt for sorting
GroupCategorySchema.index({ createdAt: -1 });

export default models.GroupCategory || model("GroupCategory", GroupCategorySchema); 