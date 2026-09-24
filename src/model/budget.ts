import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
    user: mongoose.Types.ObjectId;
    category: string;
    amount: number;
    month: number;
    year: number;
    createdAt: Date;
    updatedAt: Date;
}

export const budgetSchema: Schema<IBudget> = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true,
        min: 0
    },
    month: {
        type: Number,
        required: true,
        min: 1,
        max: 12
    },
    year: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})
budgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });
export const Budget = mongoose.models.Budget || mongoose.model<IBudget>("Budget", budgetSchema);
export default Budget;