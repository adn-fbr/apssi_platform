import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/role-page";

export const Route = createFileRoute("/association_/verification")({
  head: () => ({
    meta: [
      { title: "Verifikasi & Lisensi · BolaID" },
      { name: "description", content: "Validasi SSB, lisensi, dan kompetisi." },
      { property: "og:title", content: "Verifikasi & Lisensi · BolaID" },
      { property: "og:description", content: "Validasi SSB, lisensi, dan kompetisi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PAssociationverification,
});

function PAssociationverification() {
  return (
    <RolePage
      eyebrow="Askot PSSI Makassar"
      title="Verifikasi & Lisensi"
      stats={[
      { label: "SSB menunggu", value: "5" },
      { label: "Lisensi pelatih", value: "12", sub: "perlu cek" },
      { label: "Kompetisi", value: "3", sub: "perlu izin" },
      { label: "Disetujui", value: "48", sub: "bulan ini" }
      ]}
      sections={[
      { title: "Pendaftaran SSB", rows: [
        {"title": "SSB Tamalate Muda", "sub": "Kec. Tamalate · 42 pemain", "tag": "Menunggu", "tone": "warning"},
        {"title": "Akademi Losari", "sub": "Kec. Ujung Pandang", "tag": "Dokumen kurang", "tone": "danger"},
        {"title": "SSB Sudiang", "sub": "Kec. Biringkanaya", "tag": "Disetujui", "tone": "success"}
      ] },
      { title: "Lisensi & kompetisi", rows: [
        {"title": "Lisensi D — Coach Reza", "sub": "Dari PSSI eLearning", "tag": "Terverifikasi", "tone": "success"},
        {"title": "Lisensi C — Coach Fajar", "sub": "Unggah manual", "tag": "Cek", "tone": "warning"},
        {"title": "Turnamen Losari Cup", "sub": "U10–U12 · Des", "tag": "Perlu izin", "tone": "warning"}
      ] }
      ]}
    />
  );
}
