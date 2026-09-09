import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import CityInterestForm from "@/components/CityInterestForm";
import { IMG } from "@/lib/images";

export default function RequestCar() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const city = params.get("city") || "London";

  return (
    <main className="relative min-h-[calc(100vh-68px)] bg-[#07110D] overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <img src={IMG.taxiDriver} alt="" className="w-full h-full object-cover opacity-[0.14]" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#07110D] via-[#07110D]/94 to-[#0B2118]/85" />
        <div className="absolute -top-48 -right-40 w-[560px] h-[560px] rounded-full bg-[#0B6B4F]/26 blur-[130px]" />
        <div className="absolute inset-0 grain opacity-40" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-10 lg:py-16 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center min-h-[calc(100vh-68px)]">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="text-white">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm" data-testid="request-back"><ArrowLeft className="w-4 h-4" /> Back to results</button>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[12px] font-medium tracking-wide text-[#5FD3A6] mt-6"><Search className="w-3.5 h-3.5" /> Tell us what you want</div>
          <h1 className="mt-5 font-heading font-extrabold tracking-tight text-[36px] leading-[1.04] sm:text-5xl lg:text-[56px] text-balance">Can't find the right car in {city}?</h1>
          <p className="mt-5 text-[16px] text-white/65 max-w-md leading-relaxed">Describe exactly what you are after. We will match you the moment it comes up, and your request tells our rental partners what drivers in {city} actually want.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.55 }}
          className="w-full max-w-md justify-self-center lg:justify-self-end">
          <div className="bg-[#F9F8F6] rounded-[28px] p-6 sm:p-8 shadow-[0_40px_90px_-40px_rgba(0,0,0,0.7)]">
            <CityInterestForm city={city} mode="request" compact />
          </div>
        </motion.div>
      </div>
    </main>
  );
}
