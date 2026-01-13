import { redirect } from "next/navigation";
import { getSession } from "../server/better-auth/server";

export default async function HomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const destination =
    session.user.role === "ADMIN" ? "/admin/dashboard" : "/user/library";

  redirect(destination);
}
