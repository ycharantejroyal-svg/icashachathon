import { useMemo, useState } from "react";
import { Calendar as DayPicker } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Session = {
  id: string;
  course: string;
  location: string;
  day: "Mon" | "Tue" | "Wed" | "Thu" | "Fri";
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
                <AddClass onAdd={(s) => setSessions((prev) => [...prev, s])} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Timetable sessions={sessions} />
            </CardContent>
          </Card>
        </div>
        <div id="events" className="md:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <span>Calendar & Events</span>
                <AddEvent
                  onAdd={(e) => setEvents((prev) => [...prev, e])}
                  defaultDate={selectedDate}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border"
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

function Timetable({ sessions }: { sessions: Session[] }) {
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
                      "pointer-events-auto relative z-10 m-1 rounded-md p-2 text-xs text-white shadow-sm",
                      "bg-gradient-to-br",
                      s.color,
                    )}
                    style={{ gridRow: `${start + 1} / span ${span}` }}
                  >
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

function AddClass({ onAdd }: { onAdd: (s: Session) => void }) {
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
