import { redirect } from "next/navigation";


import { getSession } from "../../server/better-auth/server";
import { Footer } from "../../components/footer";
import { UserNavbar } from "./_components/user-navbar";

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <UserNavbar session={session} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}