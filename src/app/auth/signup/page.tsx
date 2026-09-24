"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const SiginUpSchema = z.object({
    name: z.string().min(2, "name must be at least two characters"),
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
})

export default function SignUpPage() {

    const form = useForm<z.infer<typeof SiginUpSchema>>({
        resolver: zodResolver(SiginUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof SiginUpSchema>) {
        const response = await fetch("/api/sign-up", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })
        const result = await response.json();

        console.log(result);


    }
    return (
        <form onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-lg mx-auto mt-15 rounded-md border-2 p-3 ">
            <p className=" text-center mb-3">login Form</p>
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
                <div className="border rounded-md border-gray-400">
                    <input
                        className="p-1"
                        type="password"
                        placeholder="Password"
                        {...form.register("password")}
                    />
                </div>

                {form.formState.errors.password && (
                    <p className="text-red-500 text-xs mt-1">
                        {form.formState.errors.password.message}
                    </p>
                )}
            </div>

            <button type="submit" className="
            block mx-auto
             mt-2 text-white bg-[#1447E6] box-border border border-transparent
              hover:bg-[#155DFB] font-medium leading-5 text-sm px-4 py-1 
              rounded-full duration-300 ">
                Login
            </button>
        </form>
    );
}