import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "~/server/better-auth";
import { getSession } from "~/server/better-auth/server";
import { signOutAction } from "./actions/auth"; // Adjust path to where your actions are

export default async function Home() {
  const session = await getSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          Book<span className="text-[hsl(280,100%,70%)]">worm</span>
        </h1>

        <div className="w-full max-w-md rounded-xl bg-white/10 p-8 shadow-xl">
          {session ? (
            /* LOGGED IN VIEW */
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Welcome back!</h2>
                <p className="mt-2 text-white/70">You are signed in as:</p>
              </div>
              
              <div className="w-full rounded-lg bg-black/20 p-4">
                <p className="text-sm text-white/50">Name</p>
                <p className="font-medium">{session.user?.name}</p>
                <p className="mt-2 text-sm text-white/50">Email</p>
                <p className="font-medium">{session.user?.email}</p>
              </div>

              <div className="flex flex-col gap-3 w-full">
                <Link 
                  href="/dashboard" 
                  className="flex justify-center rounded-full bg-white/20 px-10 py-3 font-semibold transition hover:bg-white/30"
                >
                  Go to Dashboard
                </Link>
                
                <form action={signOutAction}>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-red-500/20 px-10 py-3 font-semibold text-red-200 transition hover:bg-red-500/40"
                  >
                    Sign out
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* LOGGED OUT VIEW */
            <div className="flex flex-col gap-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Get Started</h2>
                <p className="text-white/60">Sign in to manage your books</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* GitHub Social Login */}
                <form>
                  <button
                    className="w-full rounded-full bg-white px-10 py-3 font-semibold text-black transition hover:bg-gray-200"
                    formAction={async () => {
                      "use server";
                      const res = await auth.api.signInSocial({
                        body: { provider: "github", callbackURL: "/" },
                      });
                      if (res?.url) redirect(res.url);
                    }}
                  >
                    Continue with Github
                  </button>
                </form>

                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4 flex-shrink text-sm text-white/30">or</span>
                  <div className="flex-grow border-t border-white/10"></div>
                </div>

                {/* Email Auth Links */}
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    className="flex justify-center rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
                  >
                    Sign In with Email
                  </Link>
                  <Link
                    href="/register"
                    className="flex justify-center rounded-full border border-white/10 px-10 py-3 font-semibold transition hover:bg-white/5"
                  >
                    Create an Account
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}