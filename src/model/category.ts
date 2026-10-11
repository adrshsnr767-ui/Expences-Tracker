import mongoose, { Document, Schema } from "mongoose";

export interface ICategory extends Document {
    user: mongoose.Types.ObjectId;
    name: string;
    createdAt: Date;
    updatedAt: Date;
}

const categorySchema: Schema<ICategory> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

categorySchema.index(
    {
        user: 1,
        name: 1,
    },
    {
        unique: true,
    }
);

const Category =
    mongoose.models.Category ||
    mongoose.model<ICategory>("Category", categorySchema);

export default Category;