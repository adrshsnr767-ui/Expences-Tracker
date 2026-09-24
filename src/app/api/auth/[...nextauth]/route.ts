import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcrypt";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },

            async authorize(credentials) {
                await dbConnect();
                const email = credentials?.email;
                const password = credentials?.password;
                if (!email || !password) {
                    return null
                }
                //find and check user exixst or not 
                const user = await User.findOne({ email })
                if (!user) {
                    return null;
                }
                // compare password
                const isPasswordCorrect = await bcrypt.compare(password, user.password)
                if (!isPasswordCorrect) {
                    return null;
                }
                return user;
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };