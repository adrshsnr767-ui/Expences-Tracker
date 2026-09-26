"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const SiginUpSchema = z.object({
    name: z.string().min(2, "name must be at least two characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUpPage() {
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof SiginUpSchema>>({
        resolver: zodResolver(SiginUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })
    const router = useRouter();
    async function onSubmit(data: z.infer<typeof SiginUpSchema>) {
        const response = await fetch("/api/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();
        if (response.ok && result.success) {
            router.push("/auth/login");
        }

        console.log(result);


    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-lg mx-auto mt-15 rounded-md border-2 p-3 ">
            <p className=" text-center mb-3">SignUp Form</p>
            <div className=" flex flex-col gap-3">

                <div className="border rounded-md border-gray-400">
                    <input
                        className="p-1"
                        type="name"
                        placeholder="Name"
                        {...form.register("name")}
                    />

                </div>
                <div className="border rounded-md border-gray-400">
                    <input
                        className="p-1"
                        type="email"
                        placeholder="Email"
                        {...form.register("email")}
                    />

                </div>
                <div className="border rounded-md border-gray-400 relative">
                    <input
                        className="p-1"
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        {...form.register("password")}

                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-1 top-1.5 text-zinc-400 "
                    >
                        {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                    </button>
                    {form.formState.errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {form.formState.errors.password.message}
                        </p>
                    )}
                </div>


            </div>

            <button type="submit" className="
                block mx-auto mt-2 text-white bg-[#1447E6] box-border border border-transparent
                hover:bg-[#155DFB] font-medium leading-5 text-sm px-4 py-1 
                rounded-full duration-300 ">
                SignUp
            </button>

            <Link
                href="/auth/login"
                className=" mt-2 text-black block text-center">
                Already Register Login
            </Link>
        </form>
    );
}