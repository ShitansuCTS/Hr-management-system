"use client";

import Link from "next/link";
import React from "react";
import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

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

      const data = await res.json();

      console.log("The login data from the backend: ", data);

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success("Login successful");

      const role = data.user.role;
      if (role === "ADMIN") {
        router.push("/dashboard/admin");
      } else {
        router.push("/dashboard/user");
      }

      // router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Welcome Back</h2>
      <h4 className="fs-13 fw-bold mb-2">Sign in to your Crusaders HRMS account</h4>
      <p className="fs-12 fw-medium text-muted">
        Welcome to <strong>Crusaders HRMS</strong>. Sign in to manage your workforce from one
        centralized platform.
      </p>
      <form className="w-100 mt-4 pt-2" onSubmit={handleLogin}>
        <div className="mb-4">
          <input
            type="email"
            className="form-control"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <div className="custom-control custom-checkbox">
              <input type="checkbox" className="custom-control-input" id="rememberMe" />
              <label className="custom-control-label c-pointer" htmlFor="rememberMe">
                Remember Me
              </label>
            </div>
          </div>
          <div>
            <Link href="/authentication/reset/forgot-password" className="fs-11 text-primary">
              Forget password?
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;
