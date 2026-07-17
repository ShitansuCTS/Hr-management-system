"use client";
import Link from "next/link";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const ResetForm = ({ path }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Send email fucntion
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
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
      <h2 className="fs-20 fw-bolder mb-4">Forgot Password</h2>
      <h4 className="fs-13 fw-bold mb-2">Reset to your username/password</h4>
      <p className="fs-12 fw-medium text-muted">
        Enter your email and a reset link will sent to you, let's access our the best recommendation
        for you.
      </p>
      <form action="auth-resetting-cover.html" className="w-100 mt-4 pt-2" onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            className="form-control"
            placeholder="Email or Username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mt-5">
          <button type="submit" className="btn btn-lg btn-primary w-100" disabled={loading}>
            {loading ? "Loading..." : "Submit Now"}
          </button>
        </div>
      </form>
      <div className="mt-5 text-center text-muted fs-13">
        <p className="mb-0">
          Already have an account?{" "}
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

export default ResetForm;
