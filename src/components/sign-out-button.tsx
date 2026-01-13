"use client";

import { Loader2, LogOut } from "lucide-react";
import React, { useState } from "react";
import { signOutAction } from "~/actions/auth";
import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

// Use React.ComponentProps to get all props from the shadcn Button
interface SignOutButtonProps extends React.ComponentProps<typeof Button> {
  showLabel?: boolean;
}

export function SignOutButton({
  className,
  variant = "ghost",
  showLabel = true,
  ...props
}: SignOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOutAction();
    } catch (error) {
      setIsLoading(false);
      console.error("Sign out failed", error);
    }
  };

  return (
    <Button
      variant={variant}
      disabled={isLoading}
      onClick={handleSignOut}
      className={cn("w-full justify-start", className)}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="mr-2 h-4 w-4" />
      )}
      {showLabel && (isLoading ? "Signing out..." : "Sign Out")}
    </Button>
  );
}
