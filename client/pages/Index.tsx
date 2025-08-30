import { useMemo, useState } from "react";
import { Calendar as DayPicker } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

type Session = {
  id: string;
  course: string;
  location: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat";
  start: string; // HH:MM
  end: string; // HH:MM
  color: string; // tailwind color class suffix e.g. "from-indigo-500 to-violet-500"
};

type UniEvent = {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time?: string; // HH:MM
};

const DAYS: Session["day"][] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const START_HOUR = 8;
const END_HOUR = 18;

export default function Index() {
  const [sessions, setSessions] = useState<Session[]>([
    { id: "m1", course: "MATHS-III", location: "AB-5 · R.02 (LG-02)", day: "Mon", start: "09:00", end: "10:00", color: "from-violet-600 to-fuchsia-600" },
    { id: "m2", course: "DAA", location: "AB-5 · R.02 (LG-02)", day: "Mon", start: "10:30", end: "11:30", color: "from-sky-500 to-cyan-500" },
    { id: "m3", course: "ML", location: "AB-5 · R.02 (LG-02)", day: "Mon", start: "11:30", end: "12:30", color: "from-emerald-500 to-teal-500" },
    { id: "m4", course: "SDOOP", location: "AB-5 · R.02 (LG-02)", day: "Mon", start: "14:00", end: "15:00", color: "from-rose-500 to-pink-500" },
    { id: "m5", course: "DAP", location: "AB-5 · R.02 (LG-02)", day: "Mon", start: "15:30", end: "16:30", color: "from-amber-500 to-orange-500" },

    { id: "t1", course: "SDOOP", location: "AB-5 · R.02 (LG-02)", day: "Tue", start: "08:00", end: "10:00", color: "from-rose-500 to-pink-500" },
    { id: "t2", course: "MATHS-III", location: "AB-5 · R.02 (LG-02)", day: "Tue", start: "10:30", end: "11:30", color: "from-violet-600 to-fuchsia-600" },
    { id: "t3", course: "DAA", location: "AB-5 · R.02 (LG-02)", day: "Tue", start: "11:30", end: "12:30", color: "from-sky-500 to-cyan-500" },
    { id: "t4", course: "SDOOP LAB", location: "Sdoop Lab · L-03", day: "Tue", start: "15:30", end: "17:30", color: "from-rose-600 to-pink-600" },

    { id: "w1", course: "ML", location: "AB-5 · R.02 (LG-02)", day: "Wed", start: "08:00", end: "09:00", color: "from-emerald-500 to-teal-500" },
    { id: "w2", course: "DAP", location: "AB-5 · R.02 (LG-02)", day: "Wed", start: "10:30", end: "11:30", color: "from-amber-500 to-orange-500" },
    { id: "w3", course: "DMS", location: "AB-5 · R.02 (LG-02)", day: "Wed", start: "11:30", end: "12:30", color: "from-indigo-500 to-blue-500" },

    { id: "th1", course: "DAP", location: "AB-5 · R.02 (LG-02)", day: "Thu", start: "08:00", end: "09:00", color: "from-amber-500 to-orange-500" },
    { id: "th2", course: "DAA", location: "AB-5 · R.02 (LG-02)", day: "Thu", start: "10:30", end: "11:30", color: "from-sky-500 to-cyan-500" },
    { id: "th3", course: "DMS", location: "AB-5 · R.02 (LG-02)", day: "Thu", start: "13:00", end: "14:00", color: "from-indigo-500 to-blue-500" },
    { id: "th4", course: "MATHS-III", location: "AB-5 · R.02 (LG-02)", day: "Thu", start: "14:00", end: "15:00", color: "from-violet-600 to-fuchsia-600" },
    { id: "th5", course: "SDOOP", location: "AB-5 · R.02 (LG-02)", day: "Thu", start: "15:30", end: "16:30", color: "from-rose-500 to-pink-500" },

    { id: "f1", course: "ML", location: "AB-5 · R.02 (LG-02)", day: "Fri", start: "08:00", end: "09:00", color: "from-emerald-500 to-teal-500" },
    { id: "f2", course: "DMS", location: "AB-5 · R.02 (LG-02)", day: "Fri", start: "10:30", end: "11:30", color: "from-indigo-500 to-blue-500" },
    { id: "f3", course: "MATHS-III", location: "AB-5 · R.02 (LG-02)", day: "Fri", start: "11:30", end: "12:30", color: "from-violet-600 to-fuchsia-600" },

    { id: "s1", course: "DMS LAB + MINI PROJECT", location: "DMS Lab · L-03", day: "Sat", start: "09:00", end: "12:00", color: "from-indigo-600 to-blue-600" },
  ]);

  const [events, setEvents] = useState<UniEvent[]>([
    ...getProvidedEvents(),
    { id: "e1", title: "Robotics Club", date: toISO(new Date()), time: "17:00" },
    { id: "e2", title: "Lab report due", date: addDaysISO(new Date(), 1) },
  ]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const selectedISO = selectedDate ? toISO(selectedDate) : undefined;

  const dayEvents = useMemo(
    () => (selectedISO ? events.filter((e) => e.date === selectedISO) : []),
    [events, selectedISO],
  );

  return (
    <div className="space-y-10">
      <Hero />

      <section id="planner" className="grid gap-6 md:grid-cols-5">
        <div id="timetable" className="md:col-span-3">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <span>Class Timetable</span>
                <AddClass existingSessions={sessions} onAdd={(s) => setSessions((prev) => [...prev, s])} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timetable sessions={sessions} onDelete={(id) => setSessions((prev) => prev.filter((s) => s.id !== id))} />
            </CardContent>
          </Card>
        </div>
        <div id="events" className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Calendar & Events</span>
                <div className="flex items-center gap-2">
                  <AutoImportAll onImport={(items) => setEvents((prev) => [...prev, ...items])} />
                  <ImportAcademic onImport={(items) => setEvents((prev) => [...prev, ...items])} />
                  <AddEvent
                    onAdd={(e) => setEvents((prev) => [...prev, e])}
                    defaultDate={selectedDate}
                  />
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-xl bg-neutral-900 p-4 text-neutral-100"
                classNames={{
                  caption: "flex items-center justify-center relative pb-2",
                  caption_label: "text-base font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-8 w-8 rounded-md text-neutral-300 hover:bg-neutral-800 p-0",
                  nav_button_previous: "absolute left-2",
                  nav_button_next: "absolute right-2",
                  head_row: "flex",
                  head_cell: "w-9 text-center text-xs text-neutral-400",
                  row: "flex w-full mt-1",
                  cell: "h-9 w-9 text-center p-0 relative",
                  day: "h-9 w-9 rounded-full text-sm hover:bg-neutral-800",
                  day_selected: "bg-blue-500 text-white",
                  day_outside: "text-neutral-500 opacity-50",
                  day_today: "ring-1 ring-blue-500",
                }}
              />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {selectedDate ? selectedDate.toDateString() : "No date selected"}
                </h3>
                <ul className="space-y-2">
                  {dayEvents.length === 0 && (
                    <li className="text-sm text-muted-foreground">
                      No events on this day
                    </li>
                  )}
                  {dayEvents.map((e) => (
                    <li
                      key={e.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div>
                        <p className="font-medium leading-none">{e.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {e.time ? e.time : "All day"}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() =>
                          setEvents((prev) => prev.filter((x) => x.id !== e.id))
                        }
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <SubjectsCard />
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-accent/10 to-transparent p-6 md:p-10">
      <div className="relative z-10 max-w-3xl">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
          Your university timetable and events, beautifully organized
        </h1>
        <p className="mt-3 text-muted-foreground md:text-lg">
          Keep on top of lectures, labs, and campus life. Add your classes and
          track upcoming deadlines and events.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#timetable">
            <Button size="lg">View Timetable</Button>
          </a>
          <a href="#events">
            <Button variant="outline" size="lg">
              View Calendar
            </Button>
          </a>
        </div>
      </div>
      <GradientOrbs />
    </section>
  );
}

function GradientOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-0">
      <div className="absolute -right-10 -top-10 size-56 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 blur-3xl" />
      <div className="absolute -bottom-12 -left-10 size-72 rounded-full bg-gradient-to-br from-accent/30 to-primary/30 blur-3xl" />
    </div>
  );
}

function Timetable({ sessions, onDelete }: { sessions: Session[]; onDelete: (id: string) => void }) {
  const rows = (END_HOUR - START_HOUR) * 2; // 30-min increments
  const times: string[] = [];
  for (let h = START_HOUR; h <= END_HOUR; h++) {
    times.push(`${String(h).padStart(2, "0")}:00`);
  }

  const sessionsByDay = useMemo(() => {
    const m: Record<string, Session[]> = {};
    for (const d of DAYS) m[d] = [];
    for (const s of sessions) m[s.day].push(s);
    return m;
  }, [sessions]);

  return (
    <div className="grid grid-cols-[64px_repeat(5,1fr)] gap-2">
      {/* Time column */}
      <div className="col-span-1">
        <div
          className="grid"
          style={{ gridTemplateRows: `repeat(${rows}, minmax(24px, 1fr))` }}
        >
          {times.slice(0, -1).map((t) => (
            <div key={t} className="text-xs text-muted-foreground">
              {t}
            </div>
          ))}
        </div>
      </div>
      {DAYS.map((day) => (
        <div key={day} className="relative col-span-1">
          <div className="mb-2 text-center text-sm font-medium">{day}</div>
          <div
            className="grid rounded-md border bg-background"
            style={{ gridTemplateRows: `repeat(${rows}, minmax(24px, 1fr))` }}
          >
            {/* grid lines */}
            {Array.from({ length: rows }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "border-b last:border-b-0",
                  i % 2 === 0 ? "border-muted" : "border-muted/60",
                )}
              />
            ))}
            {/* sessions */}
            {sessionsByDay[day]
              .sort((a, b) => timeToIndex(a.start) - timeToIndex(b.start))
              .map((s) => {
                const start = timeToIndex(s.start);
                const end = timeToIndex(s.end);
                const span = Math.max(1, end - start);
                return (
                  <div
                    key={s.id}
                    className={cn(
                      "pointer-events-auto relative z-10 m-1 rounded-md p-2 pr-7 text-xs text-white shadow-sm",
                      "bg-gradient-to-br",
                      s.color,
                    )}
                    style={{ gridRow: `${start + 1} / span ${span}` }}
                  >
                    <button
                      className="absolute right-1 top-1 rounded-md px-2 py-1 text-white/80 hover:bg-black/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(s.id);
                      }}
                      aria-label="Delete class"
                    >
                      ×
                    </button>
                    <div className="font-semibold leading-tight">{s.course}</div>
                    <div className="opacity-90">{s.location}</div>
                    <div className="opacity-90">{s.start} – {s.end}</div>
                  </div>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}

function AddClass({ onAdd, existingSessions }: { onAdd: (s: Session) => void; existingSessions: Session[] }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<
    Omit<Session, "id" | "color"> & { color: Session["color"] }
  >({
    course: "",
    location: "",
    day: "Mon",
    start: "10:00",
    end: "11:00",
    color: "from-indigo-500 to-violet-500",
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add Class
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add class to timetable</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="course">Course</Label>
              <Input
                id="course"
                value={form.course}
                onChange={(e) => setForm((f) => ({ ...f, course: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="day">Day</Label>
              <Input
                id="day"
                value={form.day}
                onChange={(e) =>
                  setForm((f) => ({ ...f, day: e.target.value as Session["day"] }))
                }
                placeholder="Mon/Tue/..."
              />
            </div>
            <div>
              <Label htmlFor="start">Start</Label>
              <Input
                id="start"
                type="time"
                value={form.start}
                onChange={(e) => setForm((f) => ({ ...f, start: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="end">End</Label>
              <Input
                id="end"
                type="time"
                value={form.end}
                onChange={(e) => setForm((f) => ({ ...f, end: e.target.value }))}
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor="color">Color gradient classes</Label>
              <Input
                id="color"
                value={form.color}
                onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                placeholder="from-indigo-500 to-violet-500"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              // Basic validations
              const validDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
              if (!validDays.includes(form.day)) {
                toast({ title: "Invalid day", description: "Use Mon/Tue/Wed/Thu/Fri/Sat" });
                return;
              }
              const startIdx = timeToIndex(form.start);
              const endIdx = timeToIndex(form.end);
              if (isNaN(startIdx) || isNaN(endIdx) || endIdx <= startIdx) {
                toast({ title: "Invalid time range", description: "End time must be after start time" });
                return;
              }
              const conflict = existingSessions.find((x) => x.day === form.day && rangesOverlap(startIdx, endIdx, timeToIndex(x.start), timeToIndex(x.end)));
              if (conflict) {
                toast({ title: "Time slot conflict", description: `${form.day} ${form.start}-${form.end} overlaps with ${conflict.course} (${conflict.start}-${conflict.end})` });
                return;
              }
              const id = Math.random().toString(36).slice(2);
              const s: Session = { id, color: form.color, ...form } as Session;
              onAdd(s);
              setOpen(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AddEvent({
  onAdd,
  defaultDate,
}: {
  onAdd: (e: UniEvent) => void;
  defaultDate?: Date;
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<string>(toISO(defaultDate ?? new Date()));
  const [time, setTime] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          Add Event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add calendar event</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-2">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              const id = Math.random().toString(36).slice(2);
              onAdd({ id, title, date, time: time || undefined });
              setOpen(false);
              setTitle("");
              setTime("");
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function timeToIndex(time: string) {
  const [h, m] = time.split(":").map((x) => parseInt(x, 10));
  return (h - START_HOUR) * 2 + Math.round(m / 30);
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number) {
  return aStart < bEnd && bStart < aEnd;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysISO(d: Date, days: number) {
  const nd = new Date(d);
  nd.setDate(d.getDate() + days);
  return toISO(nd);
}

function iso(y: number, m: number, d: number) {
  const mm = String(m).padStart(2, "0");
  const dd = String(d).padStart(2, "0");
  return `${y}-${mm}-${dd}`;
}

function AutoImportAll({ onImport }: { onImport: (items: UniEvent[]) => void }) {
  const items = getProvidedEvents();
  return (
    <Button variant="secondary" size="sm" onClick={() => onImport(items)}>
      Import All (Provided)
    </Button>
  );
}

function cryptoId() {
  return Math.random().toString(36).slice(2);
}

function getProvidedEvents(): UniEvent[] {
  return [
    { id: cryptoId(), title: "Commencement of III Semester classes", date: iso(2025, 7, 14) },
    { id: cryptoId(), title: "I year Orientation Program", date: iso(2025, 8, 9) },
    { id: cryptoId(), title: "I Sem classes start", date: iso(2025, 8, 11) },
    { id: cryptoId(), title: "I Test (III Sem)", date: iso(2025, 8, 23) },
    { id: cryptoId(), title: "I Test (I Sem)", date: iso(2025, 8, 25) },
    { id: cryptoId(), title: "Vinayaka Chaturthi", date: iso(2025, 8, 27) },
    { id: cryptoId(), title: "REVERB", date: iso(2025, 9, 13) },
    { id: cryptoId(), title: "III Sem-II test & I Sem I test", date: iso(2025, 9, 30) },
    { id: cryptoId(), title: "Maha Navami", date: iso(2025, 10, 1) },
    { id: cryptoId(), title: "Gandhi Jayanti", date: iso(2025, 10, 2) },
    { id: cryptoId(), title: "Make-up Test-III Sem", date: iso(2025, 10, 8) },
    { id: cryptoId(), title: "Deepavali", date: iso(2025, 10, 20) },
    { id: cryptoId(), title: "Karnataka Rajyotsava", date: iso(2025, 11, 1) },
    { id: cryptoId(), title: "Make-up Test-I Sem", date: iso(2025, 11, 10) },
    { id: cryptoId(), title: "Last Instructional Day-I Sem", date: iso(2025, 11, 19) },
    { id: cryptoId(), title: "End Semester Exam Starts – I & III Sem", date: iso(2025, 11, 24) },
    { id: cryptoId(), title: "Paper Seeing", date: iso(2025, 12, 13) },
    { id: cryptoId(), title: "Last Working Day · Moderation of Answerscript", date: iso(2025, 12, 15) },
    { id: cryptoId(), title: "Moderation of Answerscript", date: iso(2025, 12, 16) },
    { id: cryptoId(), title: "Christmas", date: iso(2025, 12, 25) },
    { id: cryptoId(), title: "Last date to apply for make up exam I & III Sem", date: iso(2025, 12, 26) },
    { id: cryptoId(), title: "Make up exam starts – I & III Sem", date: iso(2026, 1, 1) },
    { id: cryptoId(), title: "Commencement of II & IV Sem", date: iso(2026, 1, 5) },
    { id: cryptoId(), title: "End Semester Exam Ends – I & III Sem", date: iso(2026, 1, 6) },
    { id: cryptoId(), title: "Make up exam ends – I & III Sem", date: iso(2026, 1, 8) },
    { id: cryptoId(), title: "Make up exam Results – I & III Sem", date: iso(2026, 1, 19) },
    { id: cryptoId(), title: "Republic Day", date: iso(2026, 1, 26) },
    { id: cryptoId(), title: "I Test (II & IV Sem)", date: iso(2026, 2, 7) },
    { id: cryptoId(), title: "I Test (II & IV Sem)", date: iso(2026, 2, 9) },
    { id: cryptoId(), title: "Sports Day", date: iso(2026, 2, 14) },
    { id: cryptoId(), title: "Holi · Holiday for students only", date: iso(2026, 3, 4) },
    { id: cryptoId(), title: "Last Instructional Day – II & IV Sem", date: iso(2026, 3, 14) },
    { id: cryptoId(), title: "II Test – II & IV Sem", date: iso(2026, 3, 16) },
    { id: cryptoId(), title: "End Sem Exam starts – II & IV Sem", date: iso(2026, 3, 17) },
    { id: cryptoId(), title: "Good Friday", date: iso(2026, 4, 3) },
    { id: cryptoId(), title: "UTSAV", date: iso(2026, 4, 7) },
    { id: cryptoId(), title: "End Sem exams starts – II & IV Sem", date: iso(2026, 4, 17) },
    { id: cryptoId(), title: "May Day", date: iso(2026, 5, 1) },
    { id: cryptoId(), title: "End Sem. Exam Ends – II & IV Sem", date: iso(2026, 5, 2) },
    { id: cryptoId(), title: "Paper Seeing", date: iso(2026, 5, 8) },
    { id: cryptoId(), title: "Last Working Day · Moderation of Answerscript", date: iso(2026, 5, 11) },
    { id: cryptoId(), title: "Moderation of Answerscript", date: iso(2026, 5, 12) },
    { id: cryptoId(), title: "Results – II & IV Sem", date: iso(2026, 5, 18) },
    { id: cryptoId(), title: "Make up starts – II & IV Sem", date: iso(2026, 6, 1) },
    { id: cryptoId(), title: "Make up ends – II & IV Sem", date: iso(2026, 6, 5) },
    { id: cryptoId(), title: "III Sem. Classes Start", date: iso(2026, 7, 13) },
  ];
}

function SubjectsCard() {
  const subjects = [
    { code: "IMA 231", name: "MATHEMATICS – III" },
    { code: "ICS 231", name: "DATABASE MANAGEMENT SYSTEMS" },
    { code: "ICS 232", name: "SOFTWARE DESIGN USING OBJECT ORIENTED PARADIGM" },
    { code: "ICS 233", name: "DESIGN AND ANALYSIS OF ALGORITHMS" },
    { code: "ICS 234", name: "DATA ANALYTICS WITH PYTHON" },
    { code: "ICS 235", name: "MACHINE LEARNING" },
    { code: "ICS 231", name: "DMS LAB + MINI PROJECT" },
    { code: "ICS 232", name: "SDOOP LAB" },
  ];
  return (
    <div className="rounded-lg border p-4">
      <h4 className="mb-2 text-sm font-semibold">III Semester · CSE · Subjects</h4>
      <ul className="grid gap-1 text-sm md:grid-cols-2">
        {subjects.map((s) => (
          <li key={s.code + s.name} className="flex items-start gap-2">
            <span className="font-medium">{s.name}</span>
            <span className="text-xs text-muted-foreground">({s.code})</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">Lecture Hall: AB-5 · R. 02 (LG-02). Lab Location: SDOOP Lab and DMS Lab (Computing Lab-03, Floor-0).</p>
    </div>
  );
}

function ImportAcademic({ onImport }: { onImport: (items: UniEvent[]) => void }) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState<number>(7); // 1-12
  const [year, setYear] = useState<number>(2025);
  const [text, setText] = useState<string>("");

  const parseLines = () => {
    const lines = text.split(/\r?\n/);
    const items: UniEvent[] = [];
    let lastWithEvent: UniEvent | null = null;
    for (const raw of lines) {
      const line = raw.trim();
      if (!line) continue;
      const m = line.match(/^(\d{1,2})\s+([A-Za-z]+)(?:\s+(.*))?$/);
      if (m) {
        const day = parseInt(m[1], 10);
        const rest = (m[3] || "").trim();
        const date = toISO(new Date(year, month - 1, day));
        const id = `${date}-${Math.random().toString(36).slice(2)}`;
        const title = rest || "";
        const evt: UniEvent = { id, title: title || "", date };
        if (title) {
          items.push(evt);
          lastWithEvent = evt;
        } else {
          lastWithEvent = null;
        }
      } else if (lastWithEvent) {
        lastWithEvent.title = `${lastWithEvent.title} ${line}`.trim();
      }
    }
    onImport(items.filter((i) => i.title));
    setOpen(false);
    setText("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Import Month</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import academic month</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="month">Month</Label>
              <Input id="month" type="number" min={1} max={12} value={month} onChange={(e) => setMonth(parseInt(e.target.value || "1", 10))} />
            </div>
            <div>
              <Label htmlFor="year">Year</Label>
              <Input id="year" type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value || "2025", 10))} />
            </div>
          </div>
          <div>
            <Label htmlFor="txt">Paste one month column (e.g. \"1 W Event\")</Label>
            <Textarea id="txt" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="1 W Make up exam starts-I & III Sem\n2 T\n3 W\n4 TH\n..." />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={parseLines}>Import</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
