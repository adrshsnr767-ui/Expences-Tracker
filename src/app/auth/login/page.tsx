"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function LoginPage() {

    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })
    const router = useRouter();
    async function onSubmit(data: z.infer<typeof loginSchema>) {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: false,

        });
        if (result?.ok) {
            toast.success("Login sucessful", {
                className: "toast-success",
            })
            router.push("/dashboard");
        }
        if (result?.status === 401) {
            toast.error("User not found. Please register first.",
                {
                    className: "toast-error",
                }
            );
            return;
        }
        toast.error("Something went wrong. Please try again.",
            {
                className: "toast-error",
            }
        );

    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-lg mx-auto mt-15 rounded-md border-2 p-3 ">
            <p className=" text-center mb-3">login Form</p>
            <div className=" flex flex-col gap-3">
                <div className="border rounded-md border-gray-400">
                    <input
                        className="p-1 outline-none w-full"
                        type="email"
                        placeholder="Email"
                        {...form.register("email")}
                    />


                </div>
                {form.formState.errors.email && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.email.message}
                    </p>
                )}
                <div className="border rounded-md border-gray-400 relative" >
                    <input
                        className="p-1 outline-none w-full"
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
                </div>

                {form.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>


            <button type="submit"
                className=" block mx-auto mt-2 text-white bg-[#1447E6] box-border border border-transparent
                hover:bg-[#155DFB] font-medium leading-5 text-sm px-4 py-1 
                rounded-full duration-300 ">
                Login
            </button>

            <Link
                href="/auth/signup"
                className="block text-center mt-2 text-black ">
                New Member SignUp
            </Link>

        </form>
    );
}