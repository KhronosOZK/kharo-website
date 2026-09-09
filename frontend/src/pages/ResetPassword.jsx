import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

const inputCls = "h-12 bg-white border-[#1A2E25]/12 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

export default function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = params.get("token") || "";
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
    <main className="relative min-h-[calc(100vh-68px)] bg-[#07110D] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src={IMG.taxiDriver} alt="" className="w-full h-full object-cover opacity-[0.14]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#07110D] via-[#07110D]/94 to-[#0B2118]/85" />
        <div className="absolute -top-48 -left-40 w-[560px] h-[560px] rounded-full bg-[#0B6B4F]/28 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>
      <div className="relative max-w-md mx-auto px-4 py-20 min-h-[calc(100vh-68px)] flex items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="w-full bg-[#F9F8F6] rounded-[28px] p-7 sm:p-9 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F5F0] px-3 py-1 text-[12px] font-medium tracking-wide uppercase text-[#0B6B4F]"><Zap className="w-3.5 h-3.5" /> Set a new password</div>
          {!token ? (
            <div className="mt-5">
              <h1 className="text-2xl font-heading font-extrabold text-[#1A2E25]">This link looks incomplete</h1>
              <p className="text-[#4A564F] mt-2 text-[15px]">Please use the full link from your email, or request a new one.</p>
              <Link to="/forgot-password" className="inline-block mt-5 text-[#0B6B4F] font-semibold">Request a new link</Link>
            </div>
          ) : (
            <>
              <h1 className="text-[28px] font-heading font-extrabold text-[#1A2E25] mt-4">Choose a new password</h1>
              <p className="text-[14.5px] text-[#4A564F] mt-2 mb-7">Make it something you will remember.</p>
              <form onSubmit={submit} className="space-y-4">
                <div><Label className="text-[13px] font-medium text-[#4A564F] mb-1.5 block">New password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="reset-password" className={inputCls} placeholder="At least 6 characters" required /></div>
                <div><Label className="text-[13px] font-medium text-[#4A564F] mb-1.5 block">Confirm password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} data-testid="reset-confirm" className={inputCls} required /></div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="reset-submit">{loading ? "Updating" : "Update password"}</Button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
