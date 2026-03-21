import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, Bell, Activity } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Family Members", value: "4", icon: Users, href: "/dashboard/family", color: "text-primary" },
  { label: "Health Records", value: "12", icon: FileText, href: "/dashboard/records", color: "text-primary" },
  { label: "Medicine Reminders", value: "3", icon: Bell, href: "/dashboard/medicines", color: "text-warning" },
  { label: "Active Conditions", value: "1", icon: Activity, href: "/dashboard/records", color: "text-danger" },
];

const recentActivity = [
  { text: "Blood test report uploaded for Rahul", time: "2 hours ago", type: "record" },
  { text: "Medicine reminder: Metformin 500mg", time: "Today, 8:00 AM", type: "medicine" },
  { text: "Priya added as family member", time: "Yesterday", type: "family" },
  { text: "HbA1c report flagged — needs attention", time: "2 days ago", type: "alert" },
];

export default function HomePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-reveal">
        <h1 className="text-2xl font-bold text-foreground leading-tight">Namaste, Rahul 🙏</h1>
        <p className="text-muted-foreground mt-1">Here's your family's health overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, i) => (
          <Link key={stat.label} to={stat.href}>
            <Card className={`card-elevated border-border hover:border-primary/30 transition-all cursor-pointer animate-reveal animate-reveal-delay-${i + 1}`}>
              <CardContent className="p-4">
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <p className="text-2xl font-bold text-foreground tabular-nums">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="card-elevated border-border animate-reveal animate-reveal-delay-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-start gap-3 pb-3 border-b border-border last:border-0 last:pb-0">
              <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                item.type === "alert" ? "bg-danger" : item.type === "medicine" ? "bg-warning" : "bg-primary"
              }`} />
              <div className="min-w-0">
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.time}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
