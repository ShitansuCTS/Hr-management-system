"use client";

import Link from "next/link";
import React from "react";
import { FiFacebook, FiGithub, FiTwitter } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";

import toast from "react-hot-toast";

const LoginForm = ({ registerPath, resetPath }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuthStore();

  const handleLogin = async (e) => {
    e.preventDefault();

    const result = await login(email, password);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success("Login successful");

    if (result.user.role === "ADMIN") {
      router.replace("/dashboard/admin");
    } else {
      router.replace("/dashboard/user");
    }

    router.refresh();
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
