import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 2,
        maxlength: 50,
        validate: {
            validator: function (v: string) {
                // Allow alphanumeric characters, spaces, hyphens, underscores
                return /^[a-zA-Z0-9\s\-_]+$/.test(v);
            },
            message: 'Name can only contain alphanumeric characters, spaces, hyphens, and underscores'
        }
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
    collection: 'categories'
});

// Create case-insensitive unique index
CategorySchema.index({ name: 1 }, {
    unique: true,
    collation: { locale: "en", strength: 2 }
});

// Create index on createdAt for sorting
CategorySchema.index({ createdAt: -1 });

export default models.Category || model("Category", CategorySchema); 