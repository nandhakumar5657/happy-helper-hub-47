import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRecruit } from "@/lib/recruit-store";

export const Route = createFileRoute("/assessments")({
  head: () => ({
    meta: [
      { title: "Assessments | TalentGate" },
      {
        name: "description",
        content:
          "Send adaptive assessment links to students, track completion and record scores for shortlisting.",
      },
      { property: "og:title", content: "Assessments | TalentGate" },
      {
        property: "og:description",
        content: "Send adaptive assessment links and track scores for shortlisting.",
      },
    ],
  }),
  component: Assessments,
});

function Assessments() {
  const { assessments, candidates, jobs, sendAssessment, gradeAssessment } = useRecruit();
  const [candidateId, setCandidateId] = useState(candidates[0]?.id ?? "");
  const [jobId, setJobId] = useState(jobs[0]?.id ?? "");
  const [scores, setScores] = useState<Record<string, string>>({});

  const nameOf = (id: string) => candidates.find((c) => c.id === id)?.name ?? "Unknown";
  const roleOf = (id: string) => jobs.find((j) => j.id === id)?.title ?? "Unknown role";

  return (
    <AppShell
      title="Assessments"
      subtitle="Each link is set at a difficulty level based on the student's match score."
    >
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">Send a new assessment link</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-4">
            <div className="min-w-56 space-y-1.5">
              <Label>Student</Label>
              <Select value={candidateId} onValueChange={setCandidateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {candidates.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-56 space-y-1.5">
              <Label>Role</Label>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map((j) => (
                    <SelectItem key={j.id} value={j.id}>
                      {j.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={() => {
                if (!candidateId || !jobId) return;
                const a = sendAssessment(candidateId, jobId);
                toast.success(`Link ${a.token} sent (${a.level} level)`);
              }}
            >
              Generate link
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {assessments.map((a) => (
          <Card key={a.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div className="min-w-48">
                <p className="text-sm font-medium">{nameOf(a.candidateId)}</p>
                <p className="text-xs text-muted-foreground">
                  {roleOf(a.jobId)} · sent {a.sentAt}
                </p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {a.level}
              </Badge>
              <code className="rounded bg-muted px-2 py-1 text-xs">/assess/{a.token}</code>
              <Badge variant={a.status === "completed" ? "default" : "outline"}>
                {a.status.replace("_", " ")}
              </Badge>
              {a.status === "completed" ? (
                <span className="text-sm font-semibold tabular-nums">{a.score}%</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    className="w-20"
                    inputMode="numeric"
                    placeholder="Score"
                    value={scores[a.id] ?? ""}
                    onChange={(e) => setScores((p) => ({ ...p, [a.id]: e.target.value }))}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const v = Number(scores[a.id]);
                      if (Number.isNaN(v) || v < 0 || v > 100) {
                        toast.error("Enter a score between 0 and 100");
                        return;
                      }
                      gradeAssessment(a.id, v);
                      toast.success("Result recorded");
                    }}
                  >
                    Record
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
