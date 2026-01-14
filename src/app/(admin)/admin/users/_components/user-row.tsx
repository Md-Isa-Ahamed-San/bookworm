"use client";

import Image from "next/image";
import { Badge } from "~/components/ui/badge";
import { RoleDropdown } from "./role-dropdown";
import { useSession } from "../../../../../hooks/use-session";



type UserWithCount = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: {
    createdBooks: number;
    reviews: number;
    userBooks: number;
  };
};

export function UserRow({ user }: { user: UserWithCount }) {
  const { data: session } = useSession();
  const isCurrentUser = session?.user?.id === user.id;

  return (
    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-accent/5 transition-colors">
      {/* User Info */}
      <div className="flex items-center gap-4 flex-1">
        {/* Avatar */}
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
          {user.image ? (
            <Image
              src={user.image}
              alt={user.name}
              fill
              className="object-cover"
              sizes="48px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-primary/10 text-primary font-poppins font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-poppins font-bold text-foreground truncate">
              {user.name}
            </p>
            {isCurrentUser && (
              <Badge variant="outline" className="text-xs">You</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
          <div className="flex gap-3 text-xs text-muted-foreground mt-1">
            <span>{user._count.createdBooks} books</span>
            <span>{user._count.reviews} reviews</span>
            <span>{user._count.userBooks} shelved</span>
          </div>
        </div>
      </div>

      {/* Role Badge & Dropdown */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <Badge
          variant={user.role === "ADMIN" ? "default" : "secondary"}
          className={user.role === "ADMIN" ? "bg-primary" : ""}
        >
          {user.role}
        </Badge>

        <RoleDropdown
          userId={user.id}
          currentRole={user.role}
          disabled={isCurrentUser}
        />
      </div>
    </div>
  );
}