import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertTriangle, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HealthRecord {
  id: string;
  name: string;
  date: string;
  member: string;
  status: "normal" | "warning" | "critical";
  summary: string;
  flags: { label: string; status: "green" | "amber" | "red" }[];
}

const demoRecords: HealthRecord[] = [
  {
    id: "1",
    name: "Complete Blood Count",
    date: "15 Mar 2026",
    member: "Rahul Sharma",
    status: "warning",
    summary: "Most values within normal range. Elevated HbA1c suggests pre-diabetic condition. Recommend dietary changes and follow-up in 3 months.",
    flags: [
      { label: "Hemoglobin: 14.2 g/dL", status: "green" },
      { label: "HbA1c: 6.2%", status: "amber" },
      { label: "WBC: 7,500/μL", status: "green" },
      { label: "Platelets: 245,000/μL", status: "green" },
    ],
  },
  {
    id: "2",
    name: "Lipid Profile",
    date: "10 Mar 2026",
    member: "Priya Sharma",
    status: "critical",
    summary: "LDL cholesterol significantly elevated. Triglycerides above normal range. Immediate lifestyle intervention and possible statin therapy recommended.",
    flags: [
      { label: "Total Cholesterol: 265 mg/dL", status: "red" },
      { label: "LDL: 180 mg/dL", status: "red" },
      { label: "HDL: 42 mg/dL", status: "amber" },
      { label: "Triglycerides: 210 mg/dL", status: "red" },
    ],
  },
  {
    id: "3",
    name: "Thyroid Panel",
    date: "5 Mar 2026",
    member: "Sunita Sharma",
    status: "normal",
    summary: "All thyroid values within normal range. No intervention needed. Continue annual screening.",
    flags: [
      { label: "TSH: 2.8 mIU/L", status: "green" },
      { label: "T3: 1.2 ng/mL", status: "green" },
      { label: "T4: 8.5 μg/dL", status: "green" },
    ],
  },
];

const StatusIcon = ({ status }: { status: string }) => {
  if (status === "green") return <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />;
  if (status === "amber") return <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0" />;
  return <AlertCircle className="h-4 w-4 text-danger flex-shrink-0" />;
};

export default function HealthRecords() {
  const [records] = useState<HealthRecord[]>(demoRecords);
  const { toast } = useToast();

  const handleUpload = () => {
    toast({
      title: "Upload feature",
      description: "Connect Lovable Cloud to enable report uploads with AI analysis.",
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between animate-reveal">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Health Records</h1>
          <p className="text-muted-foreground text-sm mt-1">Upload reports and get AI-powered clinical summaries</p>
        </div>
        <Button size="sm" onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-1" /> Upload Report
        </Button>
      </div>

      <div className="space-y-4">
        {records.map((record, i) => (
          <Card key={record.id} className={`card-elevated border-border animate-reveal animate-reveal-delay-${Math.min(i + 1, 3)}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    record.status === "normal" ? "bg-success/10" : record.status === "warning" ? "bg-warning/10" : "bg-danger/10"
                  }`}>
                    <FileText className={`h-5 w-5 ${
                      record.status === "normal" ? "text-success" : record.status === "warning" ? "text-warning" : "text-danger"
                    }`} />
                  </div>
                  <div>
                    <CardTitle className="text-base">{record.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{record.member} • {record.date}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-foreground leading-relaxed">{record.summary}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {record.flags.map((flag) => (
                  <div key={flag.label} className="flex items-center gap-2 text-sm py-1.5 px-2.5 rounded-md bg-muted/50">
                    <StatusIcon status={flag.status} />
                    <span className="text-foreground">{flag.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
