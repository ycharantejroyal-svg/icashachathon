import { Outlet, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function SiteLayout() {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-background to-muted">
      <Header />
      <main className={cn("container mx-auto px-4 py-6 md:py-10")}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="group inline-flex items-center gap-2">
          <div className="size-8 rounded-md bg-gradient-to-br from-primary to-accent" />
          <span className="text-lg font-bold tracking-tight">Uni Planner</span>
        </Link>
        <div className="flex items-center gap-3">
          <a
            href="#timetable"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Timetable
          </a>
          <a
            href="#events"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Events
          </a>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-6 text-center text-sm text-muted-foreground md:flex-row">
        <p>© {new Date().getFullYear()} Uni Planner · Built for university life</p>
        <p>
          <span className="mr-1">Made by</span>
          <span className="font-medium">Charan tej Yaparala</span>
        </p>
      </div>
    </footer>
  );
}
