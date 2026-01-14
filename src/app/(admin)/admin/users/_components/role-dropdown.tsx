"use client";

import { MoreVertical, Shield, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import { useUpdateUserRole } from "~/hooks/user/use-update-user-role";

export function RoleDropdown({
  userId,
  currentRole,
  disabled,
}: {
  userId: string;
  currentRole: "USER" | "ADMIN";
  disabled?: boolean;
}) {
  const updateRole = useUpdateUserRole();

  const handleRoleChange = (newRole: "USER" | "ADMIN") => {
    if (newRole === currentRole) return;
    updateRole.mutate({ userId, role: newRole });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          disabled={disabled || updateRole.isPending}
          className="h-8 w-8"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleRoleChange("USER")}
          disabled={currentRole === "USER"}
        >
          <User className="h-4 w-4 mr-2" />
          Make User
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleRoleChange("ADMIN")}
          disabled={currentRole === "ADMIN"}
        >
          <Shield className="h-4 w-4 mr-2" />
          Make Admin
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}