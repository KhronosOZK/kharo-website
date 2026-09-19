import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Enter } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { useSeo } from "@/lib/seo";

export default function NotFound() {
  const navigate = useNavigate();

  useSeo({
    title: "Page not found · Kharo",
    description: "That page does not exist. Browse cars or head back to the Kharo homepage.",
    noindex: true,
  });

  return (
    <div className="min-h-page wrap wrap-narrow flex items-center">
      <Enter>
        <h1 className="text-h1 font-heading font-extrabold text-ink">That page has gone missing.</h1>
        <p className="mt-3 text-[15.5px] text-ink-2 leading-relaxed measure">
          The link might be out of date, or the page may have moved.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button size="lg" onClick={() => navigate("/search")}>Browse cars <ArrowRight size={16} /></Button>
          <Button size="lg" variant="outline" onClick={() => navigate("/")}>Home</Button>
        </div>
      </Enter>
    </div>
  );
}
