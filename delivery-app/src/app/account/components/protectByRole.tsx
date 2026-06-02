"use client";

import { useUser } from "@clerk/nextjs";
import React from "react";

interface ProtectByRoleProps {
  allowedRoles: ("admin" | "delivery")[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectByRole({
  allowedRoles,
  children,
  fallback = null,
}: ProtectByRoleProps) {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return null;

  const userRole = user?.publicMetadata?.role as "admin" | "delivery";

  if (isSignedIn && userRole && allowedRoles.includes(userRole)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
}
