import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSeo } from "@/lib/seo";

// Staff / legacy route, unlinked from the public site. Kept because the
// backend still needs somewhere to send drivers who request a reset link.
export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  useSeo({ title: "Reset your password · Kharo", description: "Request a password reset link for your Kharo account.", noindex: true });

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await forgotPassword(email);
    setLoading(false);
    if (res.ok) setSent(true);
    else toast.error(res.error);
  };

  return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section">
      <div className="w-full max-w-sm panel rounded-lg p-7 sm:p-8">
        <Link to="/" className="caro-wordmark text-[22px] text-ink leading-none" aria-label="Kharo home">
          kharo<span className="text-green">.</span>
        </Link>
        {sent ? (
          <div className="mt-6 text-center" data-testid="forgot-success">
            <Check className="w-10 h-10 text-green mx-auto" strokeWidth={1.75} />
            <h1 className="text-h2 font-heading font-extrabold text-ink mt-4">Check your inbox</h1>
            <p className="text-ink-2 mt-2 text-[14.5px] leading-relaxed">If an account exists for that email, we have sent a link to reset your password. It is valid for one hour.</p>
            <Link to="/login" className="inline-block mt-6 text-green font-semibold text-[14.5px]">Back to sign in</Link>
          </div>
        ) : (
          <>
            <h1 className="mt-5 text-h2 font-heading font-extrabold text-ink">Forgot your password?</h1>
            <p className="mt-1.5 text-[14.5px] text-ink-2">Enter your email and we will send you a link to set a new one.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">Email</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full" data-testid="forgot-submit">{loading ? "Sending" : "Send reset link"}</Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
