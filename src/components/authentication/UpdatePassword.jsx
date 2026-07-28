"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import toast from "react-hot-toast";

const UpdatePassword = ({ path }) => {
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const { token } = useParams(); // 👈 token from URL

  // Send email fucntion
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);

    console.log("The data is get : ", token, password, confirmpassword);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password, confirmpassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Reset successful");
        router.push("/authentication/login/minimal");
      } else {
        toast.error(data.message || "Reset failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Reset failed");
    } finally {
      setLoading(false);
    }
  };
  //Send email fucntion

  // create Account function
  const createAccount = () => {
    toast.success("Kindly connect with your Adminstrator");
  };
  // create Account function

  return (
    <>
      <h2 className="fs-20 fw-bolder mb-4">Reset Your Password</h2>
      <p className="fs-12 fw-medium text-muted">
        Update your password and begine setting up your profile.{" "}
      </p>
      <form action="auth-resetting-cover.html" className="w-100 mt-4 pt-2" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="form-control"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="form-control"
            placeholder="Confirm Password"
            value={confirmpassword}
            onChange={(e) => setConfirmpassword(e.target.value)}
            required
          />
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "Reset Now"}
          </button>
        </div>
      </form>
      <div className="mt-5 text-center text-muted fs-13">
        <p className="mb-0">
          Remember your password?{" "}
          <Link
            href="/authentication/login/minimal"
            className="fw-bold text-primary text-decoration-none"
          >
            Login
          </Link>
        </p>
      </div>
    </>
  );
};

export default UpdatePassword;
