import { signUpAction } from "../../actions/auth";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#15162c] text-white">
      <form
        action={signUpAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-white/10 p-8"
      >
        <h1 className="text-2xl font-bold">Create Account</h1>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          className="rounded bg-white/5 p-2 outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="rounded bg-white/5 p-2 outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password (min 6 chars)"
          className="rounded bg-white/5 p-2 outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <button
          type="submit"
          className="rounded bg-purple-600 py-2 font-bold hover:bg-purple-700"
        >
          Register
        </button>
      </form>
    </div>
  );
}
