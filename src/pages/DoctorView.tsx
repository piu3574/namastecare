import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, User, Calendar, FileText, AlertTriangle, CheckCircle2, AlertCircle, Activity } from "lucide-react";

const patientData: Record<string, {
  name: string; age: number; gender: string; abhaId: string; conditions: string[];
  records: { name: string; date: string; flags: { label: string; status: "green" | "amber" | "red" }[]; summary: string }[];
  medicines: { name: string; dosage: string; frequency: string }[];
}> = {
  "1": {
    name: "Rahul Sharma", age: 42, gender: "Male", abhaId: "91-1234-5678-9012",
    conditions: ["Pre-diabetes (HbA1c 6.2%)"],
    records: [
      {
        name: "Complete Blood Count", date: "15 Mar 2026", summary: "Elevated HbA1c. Recommend dietary changes.",
        flags: [
          { label: "Hemoglobin: 14.2 g/dL", status: "green" },
          { label: "HbA1c: 6.2%", status: "amber" },
          { label: "WBC: 7,500/μL", status: "green" },
        ],
      },
    ],
    medicines: [{ name: "Metformin", dosage: "500mg", frequency: "Twice daily" }],
  },
};

const defaultPatient = {
  name: "Patient", age: 0, gender: "Unknown", abhaId: "—",
  conditions: [], records: [], medicines: [],
};

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "green") return <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />;
  if (status === "amber") return <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />;
  return <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />;
};

export default function DoctorView() {
  const { token } = useParams();
  const patient = patientData[token || ""] || defaultPatient;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="hero-gradient px-4 py-6 text-primary-foreground">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          <Heart className="h-6 w-6" />
          <div>
            <h1 className="text-lg font-bold leading-tight">NamasteCare</h1>
            <p className="text-sm opacity-80">Patient Summary</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto p-4 space-y-4 animate-reveal">
        {/* Patient Info */}
        <Card className="card-elevated border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground text-lg">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">{patient.age} yrs • {patient.gender}</p>
                <p className="text-xs text-muted-foreground mt-0.5">ABHA: {patient.abhaId}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Active Conditions */}
        {patient.conditions.length > 0 && (
          <Card className="card-elevated border-border animate-reveal animate-reveal-delay-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="h-4 w-4 text-warning" /> Active Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {patient.conditions.map((c) => (
                <div key={c} className="text-sm py-1.5 px-2.5 rounded-md bg-warning/10 text-foreground mt-1">
                  {c}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Reports */}
        {patient.records.map((record) => (
          <Card key={record.name} className="card-elevated border-border animate-reveal animate-reveal-delay-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> {record.name}
              </CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {record.date}
              </p>
            </CardHeader>
            <CardContent className="space-y-2 pt-0">
              <p className="text-sm text-foreground">{record.summary}</p>
              <div className="space-y-1.5">
                {record.flags.map((flag) => (
                  <div key={flag.label} className="flex items-center gap-2 text-sm py-1 px-2 rounded bg-muted/50">
                    <StatusIcon status={flag.status} />
                    <span>{flag.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Medicines */}
        {patient.medicines.length > 0 && (
          <Card className="card-elevated border-border animate-reveal animate-reveal-delay-3">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Current Medications</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              {patient.medicines.map((med) => (
                <div key={med.name} className="text-sm py-1.5 px-2.5 rounded-md bg-muted/50">
                  <span className="font-medium text-foreground">{med.name}</span>{" "}
                  <span className="text-muted-foreground">{med.dosage} — {med.frequency}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-muted-foreground py-4">
          Shared via NamasteCare • For medical use only
        </p>
      </div>
    </div>
  );
}
