import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    await dbConnect();

    try {
        // check if the user already eists in the database
        const { name, email, password } = await request.json();
        const checkExistingUser = await User.findOne({email});
        if (checkExistingUser) {
            return Response.json(
                {
                    success: false,
                    message: "Email is already registered",
                },
                { status: 400 }
            )
        }
        // register new user 
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return Response.json(
            {
                success: true,
                message: "User created successfully",
                data: newUser,
            },
            { status: 201 }
        )

    } catch (error) {
        console.error("Error registering user:", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 }
        );
    }
}