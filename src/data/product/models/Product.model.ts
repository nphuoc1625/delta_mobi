import { Schema, models, model, Model, Document } from "mongoose";

interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    image: string;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Product name is required"],
        trim: true,
        minlength: [1, "Product name must be at least 1 character"],
        maxlength: [200, "Product name must be less than 200 characters"]
    },
    category: {
        type: String,
        required: [true, "Product category is required"],
        trim: true,
        minlength: [1, "Product category cannot be empty"]
    },
    price: {
        type: Number,
        required: [true, "Product price is required"],
        min: [0.01, "Price must be at least 0.01"],
        max: [999999.99, "Price cannot exceed 999,999.99"]
    },
    image: {
        type: String,
        required: [true, "Product image is required"],
        trim: true,
        minlength: [1, "Product image cannot be empty"]
    }
}, {
    timestamps: true,
    collection: "products"
});

// Pre-save middleware to ensure name uniqueness (case-insensitive)
ProductSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const ProductModel = this.constructor as Model<IProduct>;
        const existingProduct = await ProductModel.findOne({
            name: { $regex: new RegExp(`^${this.name}$`, "i") },
            _id: { $ne: this._id }
        });

        if (existingProduct) {
            throw new Error("Product name already exists");
        }
    }
    next();
});

// Pre-update middleware for name uniqueness
ProductSchema.pre("findOneAndUpdate", async function (next) {
    const update = this.getUpdate() as { name?: string };
    if (update.name) {
        const existingProduct = await this.model.findOne({
            name: { $regex: new RegExp(`^${update.name}$`, "i") },
            _id: { $ne: this.getQuery()._id }
        });

        if (existingProduct) {
            throw new Error("Product name already exists");
        }
    }
    next();
});

export default models.Product || model<IProduct>("Product", ProductSchema); 