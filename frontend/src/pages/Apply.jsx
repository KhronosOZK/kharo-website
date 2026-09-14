import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { getMockById } from "@/data/mockListings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ACCENT_TEXT = "#0B6B4F";

const START_OPTIONS = [
  { value: "asap", label: "As soon as possible" },
  { value: "2weeks", label: "Within 2 weeks" },
  { value: "browsing", label: "Just exploring for now" },
];

export default function Apply() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [f, setF] = useState({ name: "", email: "", phone: "", start_when: "asap", note: "" });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id && id.startsWith("mock-")) {
      const mockVehicle = getMockById(id);
      if (mockVehicle) setV(mockVehicle); else navigate("/search");
      return;
    }
    api.get(`/listings/${id}`).then((r) => setV(r.data)).catch(() => navigate("/search"));
  }, [id, navigate]); // eslint-disable-line react-hooks/exhaustive-deps

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email) {
      toast.error("Please add your name and email so we can reach you.");
      return;
    }
    setLoading(true);
    try {
      await api.post("/city-interest", {
        city: v.borough,
        name: f.name,
        email: f.email,
        phone: f.phone,
        vehicle_type: `${v.make} ${v.model}`,
        note: `Interested in ${v.make} ${v.model} (${v.id}). Wants to start: ${f.start_when}.${f.note ? " Note: " + f.note : ""}`,
      });
      setDone(true);
      window.scrollTo(0, 0);
    } catch {
      toast.error("Couldn't send that. Please try again.");
    }
    setLoading(false);
  };

  if (!v) return <div className="max-w-2xl mx-auto px-4 py-24 text-center text-[#AAA]">Loading…</div>;

  if (done) return (
    <main className="max-w-xl mx-auto px-4 py-24 text-center">
      <Check className="w-14 h-14 mx-auto" style={{ color: ACCENT_TEXT }} strokeWidth={1.75} />
      <h1 className="font-heading text-3xl font-bold text-[#111] mt-6" data-testid="apply-success">
        You're on the list
      </h1>
      <p className="text-[#666] mt-3 leading-relaxed">
        We'll email you the moment Kharo goes live in {v.borough}, with the {v.make} {v.model} and
        similar vehicles ready to view. No commitment, no charge, just first access.
      </p>
      <div className="flex gap-3 justify-center mt-8">
        <Button onClick={() => navigate("/search")} className="rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white">
          Keep browsing
        </Button>
        <Button onClick={() => navigate("/")} variant="outline" className="rounded-full">
          Back to home
        </Button>
      </div>
    </main>
  );

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm text-[#666] hover:text-[#111] transition-colors mb-6"
      >
        <ArrowLeft size={15} /> Back
      </button>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Vehicle summary */}
        <div className="lg:col-span-2 lg:order-2">
          <div className="lg:sticky lg:top-8 bg-white rounded-2xl overflow-hidden border border-[#EBEBEB]">
            <img src={Array.isArray(v.photos) ? v.photos[0] : v.photos} alt="" className="w-full h-44 object-cover" />
            <div className="p-5">
              <h3 className="font-heading font-bold text-[#111] text-lg">{v.make} {v.model}</h3>
              <p className="text-[#AAA] text-xs mt-0.5">{v.year} &middot; {v.fuel} &middot; {v.borough}</p>
              <div className="flex items-baseline gap-1 mt-4">
                <span className="font-heading font-bold text-[#111] text-3xl">£{v.weekly_rent}</span>
                <span className="text-[#AAA] text-sm">/ week</span>
              </div>
              <p className="text-[#AAA] text-xs mt-1">Rental price &middot; maintenance included &middot; insurance quoted separately</p>
              <div className="mt-4 flex items-start gap-2 text-xs text-[#666] border-t border-[#EBEBEB] pt-4">
                <ShieldCheck size={14} style={{ color: ACCENT_TEXT }} className="flex-shrink-0 mt-0.5" />
                Kharo hasn't launched in {v.borough} yet. Registering your interest costs nothing and
                puts you first in line when it does.
              </div>
            </div>
          </div>
        </div>

        {/* Interest form */}
        <div className="lg:col-span-3 lg:order-1">
          <p className="text-xs uppercase tracking-widest text-[#0B6B4F] font-semibold mb-2">Register Interest</p>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#111] mb-2" style={{ textWrap: "balance" }}>
            Get notified when this vehicle is available
          </h1>
          <p className="text-[#666] text-sm mb-7 max-w-md">
            Kharo is launching borough by borough. Leave your details and we'll reach out the moment
            the {v.make} {v.model}, or something just like it, is ready to view in {v.borough}.
          </p>

          <form onSubmit={submit} className="space-y-4 bg-white rounded-2xl border border-[#EBEBEB] p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label className="mb-1.5 block text-sm">Your name</Label>
                <Input value={f.name} onChange={set("name")} className="h-11" placeholder="Jordan Smith" required />
              </div>
              <div>
                <Label className="mb-1.5 block text-sm">Phone</Label>
                <Input value={f.phone} onChange={set("phone")} className="h-11" placeholder="07…" />
              </div>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Email</Label>
              <Input type="email" value={f.email} onChange={set("email")} className="h-11" required />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">When do you want to start driving?</Label>
              <select
                value={f.start_when}
                onChange={set("start_when")}
                className="w-full h-11 border border-[#E0E0E0] rounded-md px-3 text-sm text-[#333] bg-white focus:outline-none focus:border-[#0B6B4F]"
              >
                {START_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <Label className="mb-1.5 block text-sm">Anything else? (optional)</Label>
              <Input value={f.note} onChange={set("note")} className="h-11" placeholder="Borough, PCO experience, questions…" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-[#0B6B4F] hover:bg-[#095B43] text-white font-semibold"
              data-testid="apply-submit"
            >
              {loading ? "Sending…" : "Register Interest"}
            </Button>
            <p className="text-xs text-[#AAA] text-center">
              We'll only use these details to contact you about Kharo. Never sold on.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}
