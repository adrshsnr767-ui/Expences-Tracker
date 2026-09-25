"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login");
        }
    }, [status, router]);

    return (
        <div>
            <h1>Welcome to ExpenseFlow</h1>

            <p>{session?.user?.name}</p>

            <button onClick={() => signOut()}>
                Logout
            </button>
        </div>
    );
}