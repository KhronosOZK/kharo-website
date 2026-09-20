import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSeo } from "@/lib/seo";

// Staff / legacy route. Not linked from the header, footer or any page body:
// the public site has no sign in, only the waitlist. Kept plain for whoever
// still needs it, and because the backend's reset-password email points here.
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  useSeo({ title: "Sign in · Kharo", description: "Sign in to your Kharo account.", noindex: true });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.ok) { toast.success("Good to see you again"); navigate(res.user?.role === "admin" ? "/admin" : "/portal"); }
    else toast.error(res.error);
  };

  return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section">
      <div className="w-full max-w-sm panel rounded-lg p-7 sm:p-8">
        <Link to="/" className="caro-wordmark text-[22px] text-ink leading-none" aria-label="Kharo home">
          kharo<span className="text-green">.</span>
        </Link>
        <h1 className="mt-5 text-h2 font-heading font-extrabold text-ink">Sign in</h1>
        <p className="mt-1.5 text-[14.5px] text-ink-2">See your rentals, applications and saved cars.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">Email</Label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <Label className="text-[13px] font-medium text-ink-2">Password</Label>
              <Link to="/forgot-password" className="text-[12.5px] text-green font-medium hover:underline underline-offset-4" data-testid="login-forgot">Forgot password?</Link>
            </div>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" required />
          </div>
          <Button type="submit" disabled={loading} className="w-full" data-testid="login-submit">{loading ? "Signing in" : "Sign in"}</Button>
        </form>
      </div>
    </main>
  );
}
