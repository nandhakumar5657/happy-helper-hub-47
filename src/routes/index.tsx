import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { matchScore } from "@/lib/recruit-data";
import { useRecruit } from "@/lib/recruit-store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Placement Dashboard | TalentGate" },
      {
        name: "description",
        content:
          "Live view of open roles, screened candidates and assessment progress for your placement cell.",
      },
      { property: "og:title", content: "Placement Dashboard | TalentGate" },
      {
        property: "og:description",
        content: "Live view of open roles, screened candidates and assessment progress.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { jobs, candidates, assessments } = useRecruit();

  const completed = assessments.filter((a) => a.status === "completed");
  const avg = completed.length
    ? Math.round(completed.reduce((s, a) => s + (a.score ?? 0), 0) / completed.length)
    : 0;

  const topMatches = candidates
    .flatMap((c) =>
      jobs.map((j) => ({ candidate: c, job: j, ...matchScore(c, j) })),
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const stats = [
    { label: "Open roles", value: jobs.length },
    { label: "Candidates screened", value: candidates.length },
    { label: "Assessments sent", value: assessments.length },
    { label: "Average score", value: `${avg}%` },
  ];

  return (
    <AppShell
      title="Placement dashboard"
      subtitle="Resume screening, job matching and assessment tracking in one place."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tabular-nums">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-base">Strongest resume to role matches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {topMatches.map((m) => (
            <div key={`${m.candidate.id}-${m.job.id}`} className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">{m.candidate.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {m.job.title} · {m.job.company}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">{m.score}%</span>
              </div>
              <Progress value={m.score} />
              <div className="flex flex-wrap gap-1">
                {m.matched.map((s) => (
                  <Badge key={s} variant="secondary" className="text-[11px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next steps</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <Link to="/candidates" className="font-medium text-foreground underline">
                Add a resume
              </Link>{" "}
              to screen a new student against every open role.
            </p>
            <p>
              <Link to="/assessments" className="font-medium text-foreground underline">
                Send assessment links
              </Link>{" "}
              at the difficulty level that fits each student.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assessment pipeline</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {(["sent", "in_progress", "completed"] as const).map((status) => (
              <div key={status} className="flex items-center justify-between">
                <span className="capitalize text-muted-foreground">
                  {status.replace("_", " ")}
                </span>
                <span className="font-medium tabular-nums">
                  {assessments.filter((a) => a.status === status).length}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
