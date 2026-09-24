import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
}
const userschema: Schema<IUser> = new Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
},{
    timestamps: true,
})

const User = mongoose.models.User || mongoose.model<IUser>("User", userschema);
export default User;