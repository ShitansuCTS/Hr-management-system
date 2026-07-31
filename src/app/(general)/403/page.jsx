"use client";

import Link from "next/link";
import { FiArrowLeft, FiShield } from "react-icons/fi";
import EmptyState from "@/components/sharedUi/EmptyState";

export default function AccessDenied() {
  return (
    <EmptyState
      image="/illustrations/access-denied.png"
      imageWidth={80}
      height="75vh"
      title={
        <div className="d-flex align-items-center justify-content-center gap-2">
          <FiShield size={22} className="text-danger" />
          <span>Access Restricted</span>
        </div>
      }
      description="You don't have permission to access this page. If you believe this is a mistake, please contact your administrator."
      action={
        <Link href="/" className="btn btn-primary px-4 d-inline-flex align-items-center gap-2">
          <FiArrowLeft />
          Back to Dashboard
        </Link>
      }
    />
  );
}
