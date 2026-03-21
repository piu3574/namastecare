import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Phone, QrCode, User } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

interface FamilyMember {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  abhaId: string;
}

const initialMembers: FamilyMember[] = [
  { id: "1", name: "Rahul Sharma", age: 42, gender: "Male", phone: "+91 98765 43210", abhaId: "91-1234-5678-9012" },
  { id: "2", name: "Sunita Sharma", age: 38, gender: "Female", phone: "+91 98765 43211", abhaId: "91-1234-5678-9013" },
  { id: "3", name: "Aarav Sharma", age: 14, gender: "Male", phone: "+91 98765 43212", abhaId: "91-1234-5678-9014" },
  { id: "4", name: "Priya Sharma", age: 68, gender: "Female", phone: "+91 98765 43213", abhaId: "91-1234-5678-9015" },
];

export default function FamilyMembers() {
  const [members, setMembers] = useState<FamilyMember[]>(initialMembers);
  const [open, setOpen] = useState(false);
  const [showQr, setShowQr] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", age: "", gender: "", phone: "", abhaId: "" });

  const handleAdd = () => {
    if (!form.name || !form.age || !form.gender) return;
    setMembers((prev) => [
      ...prev,
      { id: Date.now().toString(), name: form.name, age: Number(form.age), gender: form.gender, phone: form.phone, abhaId: form.abhaId },
    ]);
    setForm({ name: "", age: "", gender: "", phone: "", abhaId: "" });
    setOpen(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between animate-reveal">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Family Members</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your family's health profiles</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm"><Plus className="h-4 w-4 mr-1" /> Add Member</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add Family Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input placeholder="e.g. Meera Sharma" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Age</Label>
                  <Input type="number" placeholder="e.g. 35" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Gender</Label>
                  <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input placeholder="+91 98765 43210" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ABHA ID</Label>
                <Input placeholder="91-XXXX-XXXX-XXXX" value={form.abhaId} onChange={(e) => setForm({ ...form, abhaId: e.target.value })} />
              </div>
              <Button className="w-full" onClick={handleAdd}>Add Member</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {members.map((member, i) => (
          <Card key={member.id} className={`card-elevated border-border animate-reveal animate-reveal-delay-${Math.min(i + 1, 3)}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.age} yrs • {member.gender}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowQr(showQr === member.id ? null : member.id)}>
                  <QrCode className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-3 space-y-1.5 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> {member.phone}
                </div>
                <p className="text-xs text-muted-foreground">ABHA: {member.abhaId}</p>
              </div>
              {showQr === member.id && (
                <div className="mt-4 flex justify-center p-4 bg-card rounded-lg border border-border">
                  <QRCodeSVG
                    value={`${window.location.origin}/doctor/${member.id}`}
                    size={140}
                    level="M"
                    fgColor="hsl(152, 55%, 33%)"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
