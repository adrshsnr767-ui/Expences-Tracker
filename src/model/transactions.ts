import mongoose, { Schema, Document } from "mongoose";

export interface ITranaction extends Document {
    user: mongoose.Types.ObjectId;
    title: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    date: Date;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

const transactionSchema: Schema<ITranaction> = new Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    amount: {
        type: Number,
        required: true
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
}, {
    timestamps: true
})
export const Transaction = mongoose.models.Transaction || mongoose.model<ITranaction>("Transaction", transactionSchema);
export default Transaction;