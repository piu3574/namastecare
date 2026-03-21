import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pill, Clock, MessageCircle } from "lucide-react";

interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  time: string;
  member: string;
  phone: string;
}

const medicines: Medicine[] = [
  { id: "1", name: "Metformin", dosage: "500mg", frequency: "Twice daily", time: "8:00 AM, 8:00 PM", member: "Rahul Sharma", phone: "919876543210" },
  { id: "2", name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", time: "9:00 PM", member: "Priya Sharma", phone: "919876543213" },
  { id: "3", name: "Thyronorm", dosage: "50mcg", frequency: "Once daily", time: "6:30 AM (empty stomach)", member: "Sunita Sharma", phone: "919876543211" },
];

export default function MedicineReminders() {
  const sendWhatsApp = (med: Medicine) => {
    const message = encodeURIComponent(
      `💊 Medicine Reminder — NamasteCare\n\nHi ${med.member.split(" ")[0]},\nTime to take your medicine:\n\n• ${med.name} ${med.dosage}\n• ${med.frequency}\n• Scheduled: ${med.time}\n\nStay healthy! 🙏`
    );
    window.open(`https://wa.me/${med.phone}?text=${message}`, "_blank");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="animate-reveal">
        <h1 className="text-2xl font-bold text-foreground">Medicine Reminders</h1>
        <p className="text-muted-foreground text-sm mt-1">Send timely medicine reminders via WhatsApp</p>
      </div>

      <div className="space-y-3">
        {medicines.map((med, i) => (
          <Card key={med.id} className={`card-elevated border-border animate-reveal animate-reveal-delay-${Math.min(i + 1, 3)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Pill className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground">{med.name} <span className="font-normal text-muted-foreground">{med.dosage}</span></p>
                    <p className="text-sm text-muted-foreground mt-0.5">{med.member}</p>
                    <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{med.frequency} — {med.time}</span>
                    </div>
                  </div>
                </div>
                <Button variant="whatsapp" size="sm" className="flex-shrink-0" onClick={() => sendWhatsApp(med)}>
                  <MessageCircle className="h-4 w-4 mr-1" /> WhatsApp
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
