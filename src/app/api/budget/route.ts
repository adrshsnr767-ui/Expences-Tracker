import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Budget from "@/model/budget";
import Category from "@/model/category";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // 1. Get logged-in user
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Receive only category ID and amount
        const { categoryId, amount } = await request.json();

        if (
            typeof categoryId !== "string" ||
            !mongoose.isValidObjectId(categoryId) ||
            amount === undefined ||
            amount === null ||
            amount === "" ||
            !Number.isFinite(Number(amount)) ||
            Number(amount) <= 0
        ) {
            return NextResponse.json(
                { message: "Valid category and amount are required" },
                { status: 400 }
            );
        }

        // 3. Find category belonging to this user
        const category = await Category.findOne({
            _id: categoryId,
            user: session.user.id,
        });

        if (!category) {
            return NextResponse.json(
                { message: "Category not found" },
                { status: 404 }
            );
        }

        // 4. Automatically determine current month and year
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        // 5. Create or update this month's budget
        const budget = await Budget.findOneAndUpdate(
            {
                user: session.user.id,
                category: category.name,
                month,
                year,
            },
            {
                $set: {
                    amount: Number(amount),
                },
            },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        return NextResponse.json(
            {
                message: "Budget saved successfully",
                data: budget,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Save budget error:", error);

        return NextResponse.json(
            { message: "Something went wrong while saving the budget" },
            { status: 500 }
        );
    }
}



export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const budgets = await Budget.find({
            user: session.user.id,
            month: now.getMonth() + 1,
            year: now.getFullYear(),
        }).lean();

        return NextResponse.json({ data: budgets }, { status: 200 });
    } catch (error) {
        console.error("Get budgets error:", error);
        return NextResponse.json(
            { message: "Something went wrong while fetching budgets" },
            { status: 500 }
        );
    }
}