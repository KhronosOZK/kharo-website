import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSeo } from "@/lib/seo";

// Staff / legacy route, unlinked from the public site. The backend's reset
// email links here with ?token=, so the route has to keep working.
export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  useSeo({ title: "Set a new password · Kharo", description: "Choose a new password for your Kharo account.", noindex: true });

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }
    if (password !== confirm) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    const res = await resetPassword(token, password);
    setLoading(false);
    if (res.ok) { toast.success("Password updated. Please sign in."); navigate("/login"); }
    else toast.error(res.error);
  };

  return (
    <main className="min-h-page bg-bone grid place-items-center px-4 py-section">
      <div className="w-full max-w-sm panel rounded-lg p-7 sm:p-8">
        <Link to="/" className="caro-wordmark text-[22px] text-ink leading-none" aria-label="Kharo home">
          kharo<span className="text-green">.</span>
        </Link>
        {!token ? (
          <div className="mt-6">
            <h1 className="text-h2 font-heading font-extrabold text-ink">This link looks incomplete</h1>
            <p className="text-ink-2 mt-2 text-[15px] leading-relaxed">Please use the full link from your email, or request a new one.</p>
            <Link to="/forgot-password" className="inline-block mt-5 text-green font-semibold text-[15px]">Request a new link</Link>
          </div>
        ) : (
          <>
            <h1 className="mt-5 text-h2 font-heading font-extrabold text-ink">Choose a new password</h1>
            <p className="mt-1.5 text-[15px] text-ink-2">Make it something you will remember.</p>
            <form onSubmit={submit} className="mt-6 space-y-4">
              <div>
                <Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">New password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="reset-password" placeholder="At least 6 characters" required />
              </div>
              <div>
                <Label className="text-[13px] font-medium text-ink-2 mb-1.5 block">Confirm password</Label>
                <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} data-testid="reset-confirm" required />
              </div>
              <Button type="submit" disabled={loading} className="w-full" data-testid="reset-submit">{loading ? "Updating" : "Update password"}</Button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
