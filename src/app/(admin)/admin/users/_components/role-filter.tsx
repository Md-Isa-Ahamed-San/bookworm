"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export function RoleFilter({
  selectedRole,
  onRoleChange,
}: {
  selectedRole?: "USER" | "ADMIN";
  onRoleChange: (role?: "USER" | "ADMIN") => void;
}) {
  return (
    <Select
      value={selectedRole || "all"}
      onValueChange={(value) => onRoleChange(value === "all" ? undefined : value as "USER" | "ADMIN")}
    >
      <SelectTrigger className="w-full sm:w-[180px] bg-input border-border">
        <SelectValue placeholder="Filter by role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Roles</SelectItem>
        <SelectItem value="USER">User</SelectItem>
        <SelectItem value="ADMIN">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}