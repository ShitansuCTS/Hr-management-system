"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [organizationId, setOrganizationId] = useState("");

    const handleSignup = async () => {
        const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email,
                password,
                organizationId,
            }),
        });

        const data = await res.json();

        if (res.ok) {
            alert("Signup successful. Please login.");
            router.push("/login");
        } else {
            alert(data.message || "Signup failed");
        }
    };

    return (
        <div>
            <h2>Signup</h2>

            <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <input
                placeholder="Organization ID"
                onChange={(e) => setOrganizationId(e.target.value)}
            />

            <button onClick={handleSignup}>Create Account</button>
        </div>
    );
}
