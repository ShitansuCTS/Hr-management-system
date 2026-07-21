"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

export default function AuthProvider({ children }) {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return children;
}
