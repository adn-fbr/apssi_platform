import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/parent_/consent")({
  head: () => ({
    meta: [
      { title: "Izin & Privasi Anak · BolaID" },
      { name: "description", content: "Kendali wali atas data anak." },
      { property: "og:title", content: "Izin & Privasi Anak · BolaID" },
      { property: "og:description", content: "Kendali wali atas data anak." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PParentconsent,
});

function PParentconsent() {
  return (
    <RolePage
      eyebrow="Guardian consent · Rizky Pratama"
      title="Izin & Privasi Anak"
      stats={[
      { label: "Izin aktif", value: "4 dari 6" },
      { label: "Akses scout", value: "Diizinkan" },
      { label: "Dicabut", value: "1", sub: "30 hari terakhir" },
      { label: "Log akses", value: "12", sub: "bulan ini" }
      ]}
      sections={[
      { title: "Siapa boleh melihat", rows: [
        {"title": "Scouting", "sub": "Scout terverifikasi melihat profil ringkas", "tag": "Aktif", "tone": "success"},
        {"title": "Profil publik", "sub": "Nama & foto di hasil turnamen", "tag": "Aktif", "tone": "success"},
        {"title": "Video pertandingan", "sub": "Dibagikan ke akademi", "tag": "Mati", "tone": "neutral"},
        {"title": "Data medis", "sub": "Hanya SSB & panitia saat laga", "tag": "Terbatas", "tone": "warning"}
      ] },
      { title: "Jejak audit", rows: [
        {"title": "Akademi XYZ melihat profil", "sub": "Hendra · Scout", "meta": "10 Nov"},
        {"title": "Panitia MYC verifikasi roster", "sub": "Football ID", "meta": "8 Nov"},
        {"title": "Izin video dicabut", "sub": "oleh Sari W.", "meta": "2 Nov", "tag": "Dicabut", "tone": "danger"}
      ] }
      ]}
    />
  );
}
