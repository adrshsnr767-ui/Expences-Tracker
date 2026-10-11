import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Category from "@/model/category";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const { name } = await request.json();

        if (!name || name.trim() === "") {
            return NextResponse.json(
                { message: "Category name is required" },
                { status: 400 }
            );
        }

        const category = await Category.create({
            user: session.user.id,
            name: name.trim(),
        });

        return NextResponse.json(
            {
                message: "Category created successfully",
                data: category,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await dbConnect();

        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const categories = await Category.find({
            user: session.user.id,
        }).sort({ createdAt: -1 });

        return NextResponse.json({
            data: categories,
        });
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            { message: "Something went wrong" },
            { status: 500 }
        );
    }
}