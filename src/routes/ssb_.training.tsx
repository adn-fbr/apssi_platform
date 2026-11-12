import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/ssb_/training")({
  head: () => ({
    meta: [
      { title: "Latihan & Absensi · BolaID" },
      { name: "description", content: "Jadwal sesi dan rekap absensi." },
      { property: "og:title", content: "Latihan & Absensi · BolaID" },
      { property: "og:description", content: "Jadwal sesi dan rekap absensi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PSsbtraining,
});

function PSsbtraining() {
  return (
    <RolePage
      eyebrow="SSB Garuda Muda · Minggu ini"
      title="Latihan & Absensi"
      stats={[
      { label: "Sesi minggu ini", value: "14" },
      { label: "Kehadiran", value: "91%" },
      { label: "Lapangan", value: "2" },
      { label: "Pelatih aktif", value: "6" }
      ]}
      sections={[
      { title: "Jadwal sesi", rows: [
        {"title": "U10 · Passing & kontrol", "sub": "Sel, 16.00 · Lap. A", "tag": "Hari ini", "tone": "signal"},
        {"title": "U12 · Transisi", "sub": "Rab, 16.00 · Lap. B", "tag": "Terjadwal", "tone": "neutral"},
        {"title": "U8 · Fun games", "sub": "Kam, 15.30 · Lap. A", "tag": "Terjadwal", "tone": "neutral"}
      ] },
      { title: "Rekap absensi", rows: [
        {"title": "U8", "meta": "95%"},
        {"title": "U10", "meta": "94%"},
        {"title": "U12", "meta": "88%"},
        {"title": "U14", "meta": "86%", "tag": "Turun", "tone": "warning"}
      ] }
      ]}
    />
  );
}
