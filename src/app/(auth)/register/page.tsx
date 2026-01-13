import { signUpAction } from "../../actions/auth";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <form
        action={signUpAction}
        className="flex w-full max-w-sm flex-col gap-4 rounded-xl bg-card p-8 border border-border shadow-sm"
      >
        <h1 className="text-2xl font-bold font-poppins">Create Account</h1>
        
        <label className="text-sm font-medium font-poppins">Full Name</label>
        <input name="name" type="text" className="bg-input border border-border p-2 rounded" required />

        <label className="text-sm font-medium font-poppins">Email</label>
        <input name="email" type="email" className="bg-input border border-border p-2 rounded" required />

        <label className="text-sm font-medium font-poppins">Profile Photo</label>
        <input name="image" type="file" accept="image/*" className="text-sm text-muted-foreground" required />

        <label className="text-sm font-medium font-poppins">Password</label>
        <input name="password" type="password" className="bg-input border border-border p-2 rounded" required />

        <button type="submit" className="bg-primary text-primary-foreground py-2 rounded font-bold hover:bg-primary/90 transition-colors">
          Register
        </button>
      </form>
    </div>
  );
}