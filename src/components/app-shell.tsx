import { Link, useRouterState } from "@tanstack/react-router";
import { BriefcaseBusiness, ClipboardList, GraduationCap, LayoutDashboard, Users } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Job descriptions", icon: BriefcaseBusiness },
  { to: "/candidates", label: "Candidates", icon: Users },
  { to: "/assessments", label: "Assessments", icon: ClipboardList },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-7xl flex-col gap-0 lg:flex-row">
        <aside className="border-border bg-sidebar lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-r">
          <div className="flex items-center gap-3 border-b border-border px-5 py-5">
            <span className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="size-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold">TalentGate</p>
              <p className="text-xs text-muted-foreground">Placement cell portal</p>
            </div>
          </div>
          <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col lg:overflow-visible">
            {nav.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground"
                  }`}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 px-5 py-8 lg:px-10">
          <header className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
