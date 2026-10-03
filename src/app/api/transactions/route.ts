import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/dbConnect";
import Transaction from "@/model/transactions";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";


type CreateTransactionBody = {
    title: string;
    amount: number;
    type: "income" | "expense";
    category?: string;
    date: Date;
    description?: string;
};

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
        const { title, amount, type, category, date, description }: CreateTransactionBody = await request.json();
        const transaction = await Transaction.create({
            user: session.user.id,
            title,
            amount,
            type,
            category,
            date,
            description,
        });
        return NextResponse.json(
            {
                message: "Transaction created successfully",
                data: transaction,
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