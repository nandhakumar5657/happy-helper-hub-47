import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { matchScore } from "@/lib/recruit-data";
import { useRecruit } from "@/lib/recruit-store";

export const Route = createFileRoute("/jobs")({
  head: () => ({
    meta: [
      { title: "Job Descriptions | TalentGate" },
      {
        name: "description",
        content:
          "Add job descriptions from recruiters and see which students match each role best.",
      },
      { property: "og:title", content: "Job Descriptions | TalentGate" },
      {
        property: "og:description",
        content: "Add job descriptions and see which students match each role best.",
      },
    ],
  }),
  component: Jobs,
});

function Jobs() {
  const { jobs, candidates, addJob } = useRecruit();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    addJob({ title, company: company || "Unnamed company", location, description });
    setTitle("");
    setCompany("");
    setLocation("");
    setDescription("");
  };

  return (
    <AppShell
      title="Job descriptions"
      subtitle="Paste a recruiter's JD — required skills are pulled out automatically."
    >
      <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Add a role</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title">Role title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={company} onChange={(e) => setCompany(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="jd">Job description</Label>
                <Textarea
                  id="jd"
                  rows={7}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the full JD here…"
                />
              </div>
              <Button type="submit" className="w-full">
                Save role
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {jobs.map((job) => {
            const ranked = candidates
              .map((c) => ({ c, ...matchScore(c, job) }))
              .sort((a, b) => b.score - a.score)
              .slice(0, 3);
            return (
              <Card key={job.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{job.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {job.company}
                    {job.location ? ` · ${job.location}` : ""}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{job.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {job.skills.length ? (
                      job.skills.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[11px]">
                          {s}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No recognised skills found in this description.
                      </span>
                    )}
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Top matches
                    </p>
                    <ul className="space-y-1.5 text-sm">
                      {ranked.map((r) => (
                        <li key={r.c.id} className="flex items-center justify-between gap-3">
                          <span>{r.c.name}</span>
                          <span className="font-medium tabular-nums">{r.score}%</span>
                        </li>
                      ))}
                    </ul>
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
