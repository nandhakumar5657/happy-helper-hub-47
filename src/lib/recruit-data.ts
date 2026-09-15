export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  skills: string[];
  description: string;
};

export type Candidate = {
  id: string;
  name: string;
  email: string;
  degree: string;
  resumeText: string;
  skills: string[];
};

export type AssessmentStatus = "sent" | "in_progress" | "completed";

export type Assessment = {
  id: string;
  candidateId: string;
  jobId: string;
  token: string;
  status: AssessmentStatus;
  score: number | null;
  sentAt: string;
  level: "foundation" | "intermediate" | "advanced";
};

const SKILL_WORDS = [
  "react",
  "typescript",
  "javascript",
  "python",
  "java",
  "sql",
  "node",
  "aws",
  "docker",
  "kubernetes",
  "machine learning",
  "nlp",
  "pandas",
  "tensorflow",
  "pytorch",
  "figma",
  "css",
  "tailwind",
  "graphql",
  "mongodb",
  "postgres",
  "spring",
  "django",
  "flask",
  "git",
  "rest api",
  "data structures",
  "algorithms",
  "testing",
  "excel",
  "power bi",
  "tableau",
];

export function extractSkills(text: string): string[] {
  const lower = text.toLowerCase();
  return SKILL_WORDS.filter((s) => lower.includes(s));
}

export type MatchResult = {
  score: number;
  matched: string[];
  missing: string[];
};

export function matchScore(candidate: Candidate, job: Job): MatchResult {
  const have = new Set(candidate.skills.map((s) => s.toLowerCase()));
  const need = job.skills.map((s) => s.toLowerCase());
  const matched = need.filter((s) => have.has(s));
  const missing = need.filter((s) => !have.has(s));
  const base = need.length ? (matched.length / need.length) * 100 : 0;
  const bonus = Math.min(have.size, 10);
  return {
    score: Math.round(Math.min(100, base * 0.85 + bonus * 1.5)),
    matched,
    missing,
  };
}

export function recommendedLevel(score: number): Assessment["level"] {
  if (score >= 75) return "advanced";
  if (score >= 45) return "intermediate";
  return "foundation";
}

export function makeToken(): string {
  return Math.random().toString(36).slice(2, 10).toUpperCase();
}

export const seedJobs: Job[] = [
  {
    id: "j1",
    title: "Frontend Engineer (Fresher)",
    company: "Northwind Technologies",
    location: "Chennai",
    skills: ["react", "typescript", "css", "git", "rest api", "testing"],
    description:
      "Build and maintain customer facing web interfaces using React and TypeScript. Strong fundamentals in CSS, REST API integration, testing and Git workflows expected.",
  },
  {
    id: "j2",
    title: "Data Analyst Trainee",
    company: "Meridian Analytics",
    location: "Bengaluru",
    skills: ["sql", "python", "pandas", "excel", "power bi"],
    description:
      "Support reporting teams with SQL queries, Python and pandas based data cleaning, and dashboarding in Power BI and Excel.",
  },
  {
    id: "j3",
    title: "Backend Developer Intern",
    company: "Orbit Systems",
    location: "Hyderabad",
    skills: ["java", "spring", "sql", "docker", "algorithms"],
    description:
      "Work on Java and Spring based microservices, relational database design, containerised deployments and core algorithmic problem solving.",
  },
];

export const seedCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Aarthi Ramesh",
    email: "aarthi.r@college.edu",
    degree: "B.Tech CSE, 2026",
    resumeText:
      "Final year CSE student. Projects in React, TypeScript, Tailwind and REST API integration. Familiar with Git and unit testing.",
    skills: ["react", "typescript", "tailwind", "rest api", "git", "testing", "css"],
  },
  {
    id: "c2",
    name: "Vikram Nair",
    email: "vikram.n@college.edu",
    degree: "B.Sc Data Science, 2026",
    resumeText:
      "Data science student with SQL, Python, pandas coursework. Built Power BI dashboards for a retail case study. Comfortable with Excel modelling.",
    skills: ["sql", "python", "pandas", "power bi", "excel"],
  },
  {
    id: "c3",
    name: "Sneha Iyer",
    email: "sneha.i@college.edu",
    degree: "B.E IT, 2027",
    resumeText:
      "Java and Spring Boot coursework, strong in data structures and algorithms, exposure to Docker and PostgreSQL.",
    skills: ["java", "spring", "algorithms", "docker", "postgres", "sql"],
  },
  {
    id: "c4",
    name: "Mohammed Faiz",
    email: "faiz.m@college.edu",
    degree: "B.Tech CSE, 2026",
    resumeText:
      "Interested in machine learning. Worked with Python, TensorFlow and NLP mini projects. Basic SQL knowledge.",
    skills: ["python", "tensorflow", "nlp", "machine learning", "sql"],
  },
];

export const seedAssessments: Assessment[] = [
  {
    id: "a1",
    candidateId: "c1",
    jobId: "j1",
    token: "K8F2QX1A",
    status: "completed",
    score: 82,
    sentAt: "2026-09-02",
    level: "advanced",
  },
  {
    id: "a2",
    candidateId: "c2",
    jobId: "j2",
    token: "M3P9ZL7B",
    status: "in_progress",
    score: null,
    sentAt: "2026-09-08",
    level: "intermediate",
  },
  {
    id: "a3",
    candidateId: "c4",
    jobId: "j2",
    token: "T5R1WD4C",
    status: "sent",
    score: null,
    sentAt: "2026-09-12",
    level: "foundation",
  },
];
