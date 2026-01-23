'use client'

import Link from 'next/link'
import React from 'react'
import { FiFacebook, FiGithub, FiTwitter } from 'react-icons/fi'
import { useRouter } from "next/navigation";
import { useState } from 'react';

const LoginForm = ({ registerPath, resetPath }) => {

    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);


    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                throw new Error("Login failed");
            }

            router.push("/");
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };



    return (
        <>

            <h2 className="fs-20 fw-bolder mb-4">Login</h2>
            <h4 className="fs-13 fw-bold mb-2">Login to your accounts</h4>
            <p className="fs-12 fw-medium text-muted">Thank you for get back <strong>Nelel</strong> web applications, let's access our the best recommendation for you.</p>
            <form className="w-100 mt-4 pt-2" onSubmit={handleLogin}>
                <div className="mb-4">
                    <input type="email" className="form-control" placeholder="Email or Username"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="d-flex align-items-center justify-content-between">
                    <div>
                        <div className="custom-control custom-checkbox">
                            <input type="checkbox" className="custom-control-input" id="rememberMe" />
                            <label className="custom-control-label c-pointer" htmlFor="rememberMe">Remember Me</label>
                        </div>
                    </div>
                    <div>
                        <Link href={resetPath} className="fs-11 text-primary">Forget password?</Link>
                    </div>
                </div>
                <div className="mt-5">
                    <button
                        type="submit"
                        className="btn btn-lg btn-primary w-100"
                        disabled={loading}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </div>

            </form>


        </>
    )
}

export default LoginForm