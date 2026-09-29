import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/lib/dbConnect";
import User from "@/model/user";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
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
                    return null;
                }

                const user = await User.findOne({ email });

                if (!user) {
                    return null;
                }

                const isPasswordCorrect = await bcrypt.compare(
                    password,
                    user.password
                );

                if (!isPasswordCorrect) {
                    return null;
                }

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }

            return token;
        },

        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }

            return session;
        },
    },
};