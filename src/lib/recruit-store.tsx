import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import {
  extractSkills,
  makeToken,
  recommendedLevel,
  matchScore,
  seedAssessments,
  seedCandidates,
  seedJobs,
  type Assessment,
  type Candidate,
  type Job,
} from "./recruit-data";

type Store = {
  jobs: Job[];
  candidates: Candidate[];
  assessments: Assessment[];
  addJob: (job: Omit<Job, "id" | "skills"> & { skills?: string[] }) => void;
  addCandidate: (input: {
    name: string;
    email: string;
    degree: string;
    resumeText: string;
  }) => void;
  sendAssessment: (candidateId: string, jobId: string) => Assessment;
  gradeAssessment: (id: string, score: number) => void;
};

const RecruitContext = createContext<Store | null>(null);

export function RecruitProvider({ children }: { children: ReactNode }) {
  const [jobs, setJobs] = useState<Job[]>(seedJobs);
  const [candidates, setCandidates] = useState<Candidate[]>(seedCandidates);
  const [assessments, setAssessments] = useState<Assessment[]>(seedAssessments);

  const value = useMemo<Store>(
    () => ({
      jobs,
      candidates,
      assessments,
      addJob: (job) =>
        setJobs((prev) => [
          {
            ...job,
            id: `j${Date.now()}`,
            skills: job.skills?.length ? job.skills : extractSkills(job.description),
          },
          ...prev,
        ]),
      addCandidate: (input) =>
        setCandidates((prev) => [
          {
            id: `c${Date.now()}`,
            ...input,
            skills: extractSkills(input.resumeText),
          },
          ...prev,
        ]),
      sendAssessment: (candidateId, jobId) => {
        const candidate = candidates.find((c) => c.id === candidateId)!;
        const job = jobs.find((j) => j.id === jobId)!;
        const { score } = matchScore(candidate, job);
        const assessment: Assessment = {
          id: `a${Date.now()}`,
          candidateId,
          jobId,
          token: makeToken(),
          status: "sent",
          score: null,
          sentAt: new Date().toISOString().slice(0, 10),
          level: recommendedLevel(score),
        };
        setAssessments((prev) => [assessment, ...prev]);
        return assessment;
      },
      gradeAssessment: (id, score) =>
        setAssessments((prev) =>
          prev.map((a) => (a.id === id ? { ...a, score, status: "completed" } : a)),
        ),
    }),
    [jobs, candidates, assessments],
  );

  return <RecruitContext.Provider value={value}>{children}</RecruitContext.Provider>;
}

export function useRecruit(): Store {
  const ctx = useContext(RecruitContext);
  if (!ctx) throw new Error("useRecruit must be used inside RecruitProvider");
  return ctx;
}
