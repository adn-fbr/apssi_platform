import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CheckCheck, MapPin, RotateCcw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Btn, PageHeader, Panel, Pill, SectionTitle, Stat } from "@/components/kit";
import { roster, sessions } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ssb_/training")({
  head: () => ({
    meta: [
      { title: "Latihan & Absensi · BolaID" },
      { name: "description", content: "Jadwal sesi latihan dan absensi pemain per kelompok usia." },
      { property: "og:title", content: "Latihan & Absensi · BolaID" },
      {
        property: "og:description",
        content: "Jadwal sesi latihan dan absensi pemain per kelompok usia.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrainingPage,
});

type Mark = "H" | "I" | "A";
type TrainingPageProps = {
  sessionsData?: typeof sessions;
  rosterData?: typeof roster;
};

const marks: { value: Mark; label: string; selectedClass: string }[] = [
  { value: "H", label: "Hadir", selectedClass: "bg-success text-primary-foreground" },
  { value: "I", label: "Izin", selectedClass: "bg-warning text-primary-foreground" },
  { value: "A", label: "Absen", selectedClass: "bg-destructive text-destructive-foreground" },
];

const markLabel: Record<Mark, string> = { H: "Hadir", I: "Izin", A: "Absen" };

function TrainingPage() {
  return <TrainingAttendancePage />;
}

export function TrainingAttendancePage({
  sessionsData = sessions,
  rosterData = roster,
}: TrainingPageProps = {}) {
  const [selectedTeam, setSelectedTeam] = useState(sessionsData[0]?.team ?? "");
  const [drafts, setDrafts] = useState<Record<string, Record<string, Mark>>>({});
  const [locallyRecorded, setLocallyRecorded] = useState<Record<string, boolean>>({});
  const [feedback, setFeedback] = useState("");
  const [reviewing, setReviewing] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  const session = sessionsData.find((item) => item.team === selectedTeam);
  const players = session ? rosterData.filter((player) => player.team === session.team) : [];
  const attendance = session ? (drafts[session.team] ?? {}) : {};
  const markedCount = players.filter((player) => attendance[player.id] !== undefined).length;
  const unmarkedCount = players.length - markedCount;
  const totals = {
    present: players.filter((player) => attendance[player.id] === "H").length,
    excused: players.filter((player) => attendance[player.id] === "I").length,
    absent: players.filter((player) => attendance[player.id] === "A").length,
  };
  const complete = players.length > 0 && unmarkedCount === 0;

  const updateMark = (playerId: string, value: Mark) => {
    if (!session) return;
    setDrafts((current) => ({
      ...current,
      [session.team]: { ...(current[session.team] ?? {}), [playerId]: value },
    }));
    setLocallyRecorded((current) => ({ ...current, [session.team]: false }));
    setReviewing(false);
    setFeedback("Draft updated.");
  };

  const resetDraft = () => {
    if (!session) return;
    setDrafts((current) => ({ ...current, [session.team]: {} }));
    setLocallyRecorded((current) => ({ ...current, [session.team]: false }));
    setReviewing(false);
    setFeedback("Draft reset. No server attendance was changed.");
    setResetOpen(false);
  };

  return (
    <div>
      <PageHeader eyebrow="SSB Garuda Muda · Demonstrasi" title="Latihan & Absensi" />

      <Panel className="mb-4 border-warning/40 bg-warning-soft">
        <p className="text-sm font-bold">Data demonstrasi</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Draft hanya tersimpan di halaman ini dan tidak disimpan ke server. Memuat ulang halaman
          akan menghapus perubahan.
        </p>
      </Panel>

      {sessionsData.length === 0 ? (
        <Panel className="py-10 text-center">
          <div role="status">
            <p className="font-semibold">Belum ada sesi latihan</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Tidak ada sesi demonstrasi yang tersedia untuk dipilih.
            </p>
          </div>
        </Panel>
      ) : (
        <>
          <div className="mb-4 max-w-xl">
            <label htmlFor="training-session" className="mb-1.5 block text-sm font-semibold">
              Pilih sesi latihan
            </label>
            <select
              id="training-session"
              value={selectedTeam}
              onChange={(event) => {
                const nextTeam = event.target.value;
                setSelectedTeam(nextTeam);
                setReviewing(false);
                setResetOpen(false);
                setFeedback(
                  Object.keys(drafts[nextTeam] ?? {}).length > 0
                    ? `Draft ${nextTeam} tetap tersedia selama halaman ini terbuka.`
                    : "",
                );
              }}
              className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {sessionsData.map((item) => {
                const hasRoster = rosterData.some((player) => player.team === item.team);
                return (
                  <option key={item.team} value={item.team}>
                    {item.team} · {item.time}
                    {hasRoster ? "" : " · roster tidak tersedia"}
                  </option>
                );
              })}
            </select>
          </div>

          {session && (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(17rem,0.8fr)]">
              <Panel>
                <SectionTitle
                  eyebrow={`${session.team} · ${session.time}`}
                  title="Absensi sesi"
                  action={<Pill tone="neutral">Draf lokal</Pill>}
                />

                {players.length === 0 ? (
                  <div role="status" className="rounded-xl bg-muted p-4">
                    <p className="text-sm font-semibold">
                      Roster demonstrasi belum tersedia untuk {session.team}
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Absensi tidak dapat diisi untuk sesi ini. Roster kelompok lain tidak
                      digunakan.
                    </p>
                  </div>
                ) : (
                  <>
                    <div
                      role="region"
                      aria-label="Ringkasan absensi"
                      aria-live="polite"
                      className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-5"
                    >
                      <Stat label="Pemain" value={players.length} />
                      <Stat label="Hadir" value={totals.present} />
                      <Stat label="Izin" value={totals.excused} />
                      <Stat label="Absen" value={totals.absent} />
                      <Stat label="Belum ditandai" value={unmarkedCount} />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {markedCount} dari {players.length} pemain ditandai
                      </p>
                      <Btn
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setDrafts((current) => ({
                            ...current,
                            [session.team]: Object.fromEntries(
                              players.map((player) => [player.id, "H" as Mark]),
                            ),
                          }));
                          setLocallyRecorded((current) => ({
                            ...current,
                            [session.team]: false,
                          }));
                          setReviewing(false);
                          setFeedback("Draft updated. All listed players are marked hadir.");
                        }}
                      >
                        <CheckCheck className="h-3.5 w-3.5" /> Semua hadir
                      </Btn>
                    </div>

                    <ul className="mt-2 divide-y border-y">
                      {players.map((player) => {
                        const selectedMark = attendance[player.id];
                        return (
                          <li
                            key={player.id}
                            className="grid gap-2 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{player.name}</p>
                              <p className="font-mono text-[11px] text-muted-foreground">
                                {player.pos} · ID {player.id}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {selectedMark ? markLabel[selectedMark] : "Belum ditandai"}
                              </p>
                            </div>
                            <div
                              className="grid grid-cols-3 gap-1"
                              role="group"
                              aria-label={`Absensi ${player.name}`}
                            >
                              {marks.map((mark) => (
                                <button
                                  key={mark.value}
                                  type="button"
                                  aria-label={`${mark.label} · ${player.name}`}
                                  aria-pressed={selectedMark === mark.value}
                                  onClick={() => updateMark(player.id, mark.value)}
                                  className={cn(
                                    "h-9 min-w-14 rounded-lg border px-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                                    selectedMark === mark.value
                                      ? mark.selectedClass
                                      : "bg-card text-muted-foreground hover:bg-muted",
                                  )}
                                >
                                  {mark.value} · {mark.label}
                                </button>
                              ))}
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {feedback && !locallyRecorded[session.team] && (
                      <p role="status" className="mt-3 text-sm text-muted-foreground">
                        {feedback}
                      </p>
                    )}
                    {locallyRecorded[session.team] && (
                      <p role="status" className="mt-3 rounded-xl bg-warning-soft p-3 text-sm">
                        Demo attendance recorded locally for this page session. This demonstration
                        does not save attendance to the server.
                      </p>
                    )}

                    {reviewing ? (
                      <Panel className="mt-4 bg-secondary/50">
                        <SectionTitle
                          eyebrow="Tinjau sebelum konfirmasi lokal"
                          title="Draf absensi"
                        />
                        <ul className="divide-y">
                          {players.map((player) => (
                            <li
                              key={player.id}
                              className="flex items-center justify-between gap-3 py-2 text-sm"
                            >
                              <span className="min-w-0 truncate font-medium">{player.name}</span>
                              <Pill tone="neutral">{markLabel[attendance[player.id]!]}</Pill>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-3 text-xs text-muted-foreground">
                          Konfirmasi ini hanya menandai draf demonstrasi di halaman saat ini.
                        </p>
                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                          <Btn type="button" variant="outline" onClick={() => setReviewing(false)}>
                            Kembali ke draf
                          </Btn>
                          <Btn
                            type="button"
                            variant="signal"
                            onClick={() => {
                              setLocallyRecorded((current) => ({
                                ...current,
                                [session.team]: true,
                              }));
                              setReviewing(false);
                              setFeedback("");
                            }}
                          >
                            Konfirmasi demo lokal
                          </Btn>
                        </div>
                      </Panel>
                    ) : (
                      <div className="mt-4 grid gap-2 sm:grid-cols-[auto_1fr]">
                        <Btn
                          type="button"
                          variant="outline"
                          disabled={markedCount === 0}
                          onClick={() => setResetOpen(true)}
                        >
                          <RotateCcw className="h-4 w-4" /> Reset draf
                        </Btn>
                        <Btn type="button" disabled={!complete} onClick={() => setReviewing(true)}>
                          {complete ? "Tinjau draf" : `Tandai ${unmarkedCount} pemain lagi`}
                        </Btn>
                      </div>
                    )}

                    <AlertDialog open={resetOpen} onOpenChange={setResetOpen}>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset draf {session.team}?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Semua pilihan demonstrasi untuk sesi ini akan dihapus dari halaman saat
                            ini. Tidak ada data server yang akan diubah.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Pertahankan draf</AlertDialogCancel>
                          <AlertDialogAction onClick={resetDraft}>Reset draf</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </>
                )}
              </Panel>

              <Panel className="h-fit">
                <SectionTitle eyebrow="Detail sesi" title={session.team} />
                <dl className="space-y-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Waktu</dt>
                    <dd className="font-semibold">{session.time}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Lokasi</dt>
                    <dd className="flex items-start gap-1.5 font-semibold">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                      {session.place}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Pelatih</dt>
                    <dd className="font-semibold">{session.coach}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Rencana sesi</dt>
                    <dd className="font-semibold">{session.plan}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Roster demo</dt>
                    <dd className="font-semibold">
                      {players.length > 0
                        ? `${players.length} pemain dengan kelompok ${session.team}`
                        : "Tidak tersedia untuk kelompok ini"}
                    </dd>
                  </div>
                </dl>
              </Panel>
            </div>
          )}
        </>
      )}
    </div>
  );
}
