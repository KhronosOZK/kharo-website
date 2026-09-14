import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useSeo } from "@/lib/seo";

export default function NotFound() {
  const navigate = useNavigate();

  useSeo({
    title: "Page not found · Kharo",
    description: "That page doesn't exist. Browse PCO cars or head back to the Kharo homepage.",
  });

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-20" style={{ backgroundColor: "#FAFAFA" }}>
      <div className="max-w-md mx-auto text-center">
        <p className="font-heading font-extrabold text-[#0B6B4F] text-[80px] leading-none">404</p>
        <h1 className="text-[26px] font-heading font-extrabold text-[#111] mt-2">
          That page has gone missing.
        </h1>
        <p className="text-[#666] text-[15px] mt-3 leading-relaxed">
          The link might be out of date, or the page may have moved. Try browsing cars,
          or head back to the homepage.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate("/search")}
            className="px-7 py-3.5 rounded-full bg-[#0B6B4F] text-white font-semibold text-[15px] hover:bg-[#095B43] transition-colors"
          >
            Browse PCO cars
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-7 py-3.5 rounded-full border border-[#D8D8D8] text-[#111] font-medium text-[15px] hover:bg-white transition-colors flex items-center gap-2"
          >
            Kharo homepage
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
