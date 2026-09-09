import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Zap, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IMG } from "@/lib/images";

const inputCls = "h-12 bg-white border-[#1A2E25]/12 rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
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
          <div className="inline-flex items-center gap-2 rounded-full bg-[#E6F5F0] px-3 py-1 text-[12px] font-medium tracking-wide uppercase text-[#0B6B4F]"><Zap className="w-3.5 h-3.5" /> Account help</div>
          {sent ? (
            <div className="mt-5 text-center py-4" data-testid="forgot-success">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto"><Check className="w-7 h-7 text-emerald-700" /></div>
              <h1 className="text-2xl font-heading font-extrabold text-[#1A2E25] mt-4">Check your inbox</h1>
              <p className="text-[#4A564F] mt-2 text-[15px]">If an account exists for that email, we have sent a link to reset your password. It is valid for one hour.</p>
              <Link to="/login" className="inline-block mt-6 text-[#0B6B4F] font-semibold">Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-[28px] font-heading font-extrabold text-[#1A2E25] mt-4">Forgot your password?</h1>
              <p className="text-[14.5px] text-[#4A564F] mt-2 mb-7">Enter your email and we will send you a link to set a new one.</p>
              <form onSubmit={submit} className="space-y-4">
                <div><Label className="text-[13px] font-medium text-[#4A564F] mb-1.5 block">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="forgot-email" className={inputCls} required /></div>
                <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white" data-testid="forgot-submit">{loading ? "Sending" : "Send reset link"}</Button>
              </form>
              <p className="text-[13px] text-[#7A857F] mt-6 text-center">Remembered it? <Link to="/login" className="text-[#0B6B4F] font-semibold">Sign in</Link></p>
            </>
          )}
        </motion.div>
      </div>
    </main>
  );
}
