import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Shield, Users, FileText, Bell, Smartphone } from "lucide-react";

const features = [
  { icon: Users, title: "Family Profiles", desc: "Add all family members with ABHA ID and QR codes for easy sharing" },
  { icon: FileText, title: "Smart Records", desc: "Upload reports and get AI-powered clinical summaries with color-coded flags" },
  { icon: Bell, title: "Medicine Alerts", desc: "Send timely medicine reminders directly via WhatsApp" },
  { icon: Smartphone, title: "Doctor View", desc: "Share patient summaries with doctors via QR code — no login needed" },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <nav className="flex items-center justify-between px-4 md:px-8 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg text-foreground tracking-tight">NamasteCare</span>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-4 md:px-8 pt-16 pb-20 max-w-5xl mx-auto text-center animate-reveal">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full mb-6">
          <Shield className="h-3.5 w-3.5" /> Built for Indian families
        </div>
        <h1 className="text-3xl md:text-5xl font-bold text-foreground max-w-2xl mx-auto leading-[1.1]">
          Your family's health, organized and accessible
        </h1>
        <p className="text-muted-foreground mt-4 max-w-lg mx-auto text-base md:text-lg">
          Store health records, track medicines, and share patient summaries with doctors — all in one place.
        </p>
        <div className="flex gap-3 justify-center mt-8">
          <Button size="lg" asChild>
            <Link to="/signup">Create free account</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link to="/doctor/1">See doctor view</Link>
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 md:px-8 pb-20 max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
          {features.map((f, i) => (
            <div key={f.title} className={`p-5 md:p-6 rounded-xl bg-card border border-border card-elevated animate-reveal animate-reveal-delay-${Math.min(i + 1, 3)}`}>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                <f.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        © 2026 NamasteCare. Your health data stays private and secure.
      </footer>
    </div>
  );
}
