import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const inputCls = "h-12 bg-white border-[#E8E8E8] rounded-xl focus-visible:ring-[#0B6B4F]/30 focus-visible:border-[#0B6B4F]";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
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
    <main className="bg-[#F5F5F5] min-h-[calc(100vh-68px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 lg:py-20 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center lg:text-left">
          <p className="text-[13px] font-medium text-[#0B6B4F] tracking-[0.12em] uppercase">Welcome back</p>
          <h1 className="mt-3 font-heading font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-[1.03] text-[#0A0A0A] text-balance">
            Back to the<br /><span className="text-[#0B6B4F]">driver's seat.</span>
          </h1>
          <div className="mt-8 max-w-md mx-auto lg:mx-0 text-left rounded-[24px] bg-[#EBEBEB] p-6 sm:p-7">
            <p className="text-[18px] font-heading font-semibold text-[#0A0A0A] leading-snug">"I knew exactly what I was paying before I turned up. First time that has happened."</p>
            <p className="text-[#888888] mt-3 text-sm">Amara, private hire driver in Croydon</p>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end bg-white rounded-[24px] ring-1 ring-[#E8E8E8]/70 p-7 sm:p-9 shadow-sm">
          <h2 className="text-3xl font-heading font-bold text-[#0A0A0A]">Sign in</h2>
          <p className="text-[15px] text-[#666666] mt-2 mb-7">See your rentals, applications and saved cars.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label className="text-[13px] font-medium text-[#666666] mb-1.5 block">Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="login-email" className={inputCls} required /></div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <Label className="text-[13px] font-medium text-[#666666]">Password</Label>
                <Link to="/forgot-password" className="text-[12.5px] text-[#0B6B4F] font-medium hover:underline" data-testid="login-forgot">Forgot password?</Link>
              </div>
              <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} data-testid="login-password" className={inputCls} required />
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white hover:-translate-y-[2px] transition-transform" data-testid="login-submit">{loading ? "Signing in" : "Sign in"}</Button>
          </form>
          <div className="mt-5 flex items-center gap-2 text-[12.5px] text-[#888888]"><ShieldCheck className="w-4 h-4 text-[#0B6B4F]" strokeWidth={1.6} /> Your details are encrypted and never sold on.</div>
          <p className="text-[14px] text-[#666666] mt-6 text-center">New here? <Link to="/register" className="text-[#0B6B4F] font-semibold">Create your driver account</Link></p>
          <p className="text-[13px] text-[#888888] mt-2 text-center">Run a fleet? <Link to="/operator-login" className="text-[#0B6B4F] font-medium">Operator sign in</Link></p>
        </motion.div>
      </div>
    </main>
  );
}
