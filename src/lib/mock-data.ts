// Demo data for the UI prototype. Nothing here is persisted.

export const player = {
  name: "Rizky Pratama",
  initials: "RP",
  footballId: "IDN-FB-2016-000123",
  birthYear: 2016,
  category: "U10",
  position: "CM / AM",
  foot: "Kanan",
  organization: "SSB Garuda Muda",
  city: "Makassar, Sulawesi Selatan",
  verified: true,
  guardian: "Sari Wulandari",
  stats: { matches: 34, minutes: 1840, goals: 9, assists: 14, attendance: 94 },
};

export type JourneyStep = {
  year: number;
  org: string;
  label: string;
  kind: "ssb" | "tournament" | "selection" | "academy";
  current?: boolean;
  upcoming?: boolean;
};

export const journey: JourneyStep[] = [
  { year: 2024, org: "SSB Garuda Muda", label: "Bergabung · U8", kind: "ssb" },
  { year: 2025, org: "SSB Garuda Muda", label: "Naik ke U9 · Kapten tim", kind: "ssb" },
  { year: 2026, org: "Makassar Youth Cup", label: "U10 · Juara 2 · 4 gol", kind: "tournament", current: true },
  { year: 2026, org: "Seleksi Regional Sulsel", label: "Lolos tahap 1", kind: "selection", current: true },
  { year: 2027, org: "Akademi XYZ", label: "Undangan trial U11", kind: "academy", upcoming: true },
];

export const developmentGroups = [
  { key: "Teknik", score: 7.6 },
  { key: "Taktik", score: 6.9 },
  { key: "Fisik", score: 7.4 },
  { key: "Mental", score: 8.1 },
  { key: "Sosial", score: 8.4 },
];

export const developmentTimeline = [
  { period: "2026 Q1", passing: 6.2, dribbling: 6.8, speed: 7.1 },
  { period: "2026 Q3", passing: 7.1, dribbling: 7.5, speed: 7.4 },
  { period: "2027 Q1", passing: 7.8, dribbling: 8.0, speed: 7.9 },
];

export const assessmentDetail = [
  { group: "Teknik", items: [["Kontrol bola", 7.8], ["Passing", 7.8], ["Receiving", 6.6], ["Dribbling", 8.0], ["Shooting", 7.2]] },
  { group: "Taktik", items: [["Positioning", 6.8], ["Pengambilan keputusan", 7.0], ["Awareness", 6.9]] },
  { group: "Mental", items: [["Disiplin", 8.2], ["Kerja sama", 8.5], ["Percaya diri", 7.6], ["Mau dilatih", 8.3]] },
] as const;

export const recentMatches = [
  { date: "02 Nov", comp: "Liga Grassroots Makassar", opp: "SSB Bintang Timur", score: "3–1", result: "M", mins: 50, contrib: "1 gol · 1 assist" },
  { date: "26 Okt", comp: "Makassar Youth Cup · Final", opp: "SSB Pelita Gowa", score: "1–2", result: "K", mins: 50, contrib: "1 assist" },
  { date: "25 Okt", comp: "Makassar Youth Cup · SF", opp: "SSB Maros Raya", score: "2–2", result: "S", mins: 45, contrib: "1 gol" },
  { date: "19 Okt", comp: "Uji coba", opp: "SSB Karebosi", score: "4–0", result: "M", mins: 30, contrib: "2 assist" },
] as const;

export const certificates = [
  { title: "Juara 2 · Makassar Youth Cup U10", issuer: "Panitia MYC", year: 2026 },
  { title: "Pemain Terbaik Bulan Agustus", issuer: "SSB Garuda Muda", year: 2026 },
];

export const children = [
  {
    id: "rizky",
    name: "Rizky",
    initials: "RP",
    category: "U10",
    org: "SSB Garuda Muda",
    attendance: 94,
    devScore: 7.7,
    devTrend: 0.4,
    training: { time: "16.00", place: "Lapangan Karebosi", coach: "Coach Andi" },
    match: { day: "Sabtu, 14 Nov", time: "08.30", opp: "SSB Bintang Timur", venue: "Stadion Mini Gowa" },
    invoice: { label: "Iuran November", amount: 150000, status: "unpaid" as const, due: "15 Nov" },
  },
  {
    id: "aisyah",
    name: "Aisyah",
    initials: "AP",
    category: "U8",
    org: "SSB Garuda Muda",
    attendance: 88,
    devScore: 7.1,
    devTrend: 0.6,
    training: { time: "15.30", place: "Lapangan Karebosi", coach: "Coach Dewi" },
    match: { day: "Minggu, 15 Nov", time: "09.00", opp: "SSB Pelita Gowa", venue: "Lapangan Hasanuddin" },
    invoice: { label: "Iuran November", amount: 150000, status: "paid" as const, due: "15 Nov" },
  },
];

export const parentMessages = [
  { from: "Coach Andi", role: "Pelatih U10", text: "Latihan hari ini fokus first touch. Bawa botol minum 1L ya.", time: "10.12" },
  { from: "Admin SSB", role: "SSB Garuda Muda", text: "Jersey musim baru sudah bisa diambil di sekretariat.", time: "Kemarin" },
  { from: "Panitia MYC", role: "Turnamen", text: "Sertifikat Juara 2 sudah masuk ke Football Passport.", time: "Sen" },
];

export const auditTrail = [
  { who: "Coach Andi", what: "melihat laporan perkembangan", when: "2 hari lalu" },
  { who: "Panitia MYC 2027", what: "memverifikasi Football ID untuk roster", when: "5 hari lalu" },
  { who: "Anda", what: "mematikan izin scouting", when: "3 minggu lalu" },
];

export const ssb = {
  name: "SSB Garuda Muda",
  city: "Makassar",
  orgId: "ORG-SSB-MKS-0042",
  players: 186,
  teams: 9,
  coaches: 12,
  collection: 82,
};

export const teams = [
  { name: "U7", players: 18 },
  { name: "U8", players: 22 },
  { name: "U9", players: 24 },
  { name: "U10", players: 26 },
  { name: "U11", players: 21 },
  { name: "U12", players: 25 },
  { name: "U13", players: 20 },
  { name: "U14", players: 17 },
  { name: "U15", players: 13 },
];

export const roster = [
  { name: "Rizky Pratama", id: "000123", team: "U10", pos: "CM", att: 94, fee: "unpaid" },
  { name: "Fajar Nugraha", id: "000131", team: "U10", pos: "GK", att: 97, fee: "paid" },
  { name: "Muh. Alif", id: "000188", team: "U10", pos: "CB", att: 81, fee: "paid" },
  { name: "Daffa Ramadhan", id: "000204", team: "U10", pos: "ST", att: 90, fee: "late" },
  { name: "Andi Baso", id: "000219", team: "U10", pos: "LW", att: 86, fee: "paid" },
  { name: "Yusuf Hakim", id: "000233", team: "U10", pos: "RB", att: 92, fee: "paid" },
  { name: "Naufal Akbar", id: "000241", team: "U10", pos: "CM", att: 78, fee: "unpaid" },
  { name: "Reza Mahendra", id: "000257", team: "U10", pos: "LB", att: 95, fee: "paid" },
] as const;

export const sessions = [
  { team: "U10", time: "16.00–17.30", coach: "Coach Andi", place: "Lapangan Karebosi", plan: "First touch & receiving under pressure" },
  { team: "U8", time: "15.30–16.30", coach: "Coach Dewi", place: "Lapangan Karebosi", plan: "Koordinasi & permainan kecil 4v4" },
  { team: "U13", time: "17.00–18.30", coach: "Coach Rahmat", place: "GOR Sudiang", plan: "Transisi menyerang" },
];

export const tournament = {
  name: "Makassar Youth Cup 2027",
  organizer: "Asosiasi Sepak Bola Usia Dini Makassar",
  dates: "13–21 Feb 2027",
  venues: 4,
  categories: ["U8", "U10", "U12", "U14"],
  teams: 64,
  players: 1280,
  referees: 22,
  verified: 98,
};

export const standings = [
  { team: "SSB Garuda Muda", p: 3, w: 2, d: 1, l: 0, gf: 8, ga: 3, pts: 7 },
  { team: "SSB Pelita Gowa", p: 3, w: 2, d: 0, l: 1, gf: 6, ga: 4, pts: 6 },
  { team: "SSB Maros Raya", p: 3, w: 1, d: 1, l: 1, gf: 5, ga: 5, pts: 4 },
  { team: "SSB Bintang Timur", p: 3, w: 0, d: 0, l: 3, gf: 1, ga: 8, pts: 0 },
];

export const fixtures = [
  { status: "live" as const, minute: "34'", home: "SSB Garuda Muda", away: "SSB Karebosi", hs: 2, as: 1, venue: "Lapangan A · Karebosi", ref: "Ahmad S.", group: "Grup A" },
  { status: "done" as const, minute: "FT", home: "SSB Pelita Gowa", away: "SSB Maros Raya", hs: 1, as: 1, venue: "Lapangan B · Karebosi", ref: "Budi H.", group: "Grup A" },
  { status: "next" as const, minute: "14.00", home: "SSB Bintang Timur", away: "SSB Takalar FC", hs: null, as: null, venue: "Stadion Mini Gowa", ref: "Irfan M.", group: "Grup B" },
  { status: "next" as const, minute: "15.30", home: "SSB Hasanuddin", away: "SSB Pangkep Jaya", hs: null, as: null, venue: "Stadion Mini Gowa", ref: "Ahmad S.", group: "Grup B" },
];

export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
