import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { matchScore } from "@/lib/recruit-data";
import { useRecruit } from "@/lib/recruit-store";

export const Route = createFileRoute("/candidates")({
  head: () => ({
    meta: [
      { title: "Candidate Screening | TalentGate" },
      {
        name: "description",
        content:
          "Upload student resumes, extract skills automatically and rank them against every open role.",
      },
      { property: "og:title", content: "Candidate Screening | TalentGate" },
      {
        property: "og:description",
        content: "Upload student resumes and rank them against every open role.",
      },
    ],
  }),
  component: Candidates,
});

function Candidates() {
  const { candidates, jobs, addCandidate, sendAssessment } = useRecruit();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [degree, setDegree] = useState("");
  const [resumeText, setResumeText] = useState("");

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    const text = await file.text();
    setResumeText(text);
    if (!name) setName(file.name.replace(/\.[^.]+$/, ""));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !resumeText.trim()) return;
    addCandidate({ name, email, degree, resumeText });
    toast.success(`${name} screened against ${jobs.length} roles`);
    setName("");
    setEmail("");
    setDegree("");
    setResumeText("");
  };

  return (
    <AppShell
      title="Candidates"
      subtitle="Add a resume as a text or markdown file, or paste its content directly."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Add a resume</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="file">Resume file (.txt, .md)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".txt,.md,text/plain"
                  onChange={(e) => onFile(e.target.files?.[0])}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="name">Student name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="degree">Degree and batch</Label>
                <Input id="degree" value={degree} onChange={(e) => setDegree(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="resume">Resume content</Label>
                <Textarea
                  id="resume"
                  rows={7}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                Screen candidate
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {candidates.map((c) => {
            const ranked = jobs
              .map((j) => ({ j, ...matchScore(c, j) }))
              .sort((a, b) => b.score - a.score);
            return (
              <Card key={c.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{c.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {c.degree}
                    {c.email ? ` · ${c.email}` : ""}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-1">
                    {c.skills.map((s) => (
                      <Badge key={s} variant="secondary" className="text-[11px]">
                        {s}
                      </Badge>
                    ))}
                  </div>
                  <div className="space-y-3">
                    {ranked.map((r) => (
                      <div key={r.j.id} className="space-y-1.5">
                        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            {r.j.title}{" "}
                            <span className="text-muted-foreground">· {r.j.company}</span>
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="font-medium tabular-nums">{r.score}%</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const a = sendAssessment(c.id, r.j.id);
                                toast.success(
                                  `${a.level} assessment link ${a.token} created for ${c.name}`,
                                );
                              }}
                            >
                              Send assessment
                            </Button>
                          </div>
                        </div>
                        <Progress value={r.score} />
                        {r.missing.length ? (
                          <p className="text-xs text-muted-foreground">
                            Gaps to train: {r.missing.join(", ")}
                          </p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
