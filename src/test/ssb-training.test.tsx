import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (config: unknown) => config,
}));

import { TrainingAttendancePage } from "@/routes/ssb_.training";
import { roster, sessions } from "@/lib/mock-data";

describe("SSB training attendance demo", () => {
  it("selects a session and never reuses the U10 roster for other teams", () => {
    render(<TrainingAttendancePage />);

    const sessionSelect = screen.getByLabelText("Pilih sesi latihan");
    expect(screen.getByText("Rizky Pratama")).toBeInTheDocument();

    fireEvent.change(sessionSelect, { target: { value: "U8" } });
    expect(screen.getByText("Roster demonstrasi belum tersedia untuk U8")).toBeInTheDocument();
    expect(screen.queryByText("Rizky Pratama")).not.toBeInTheDocument();

    fireEvent.change(sessionSelect, { target: { value: "U13" } });
    expect(screen.getByText("Roster demonstrasi belum tersedia untuk U13")).toBeInTheDocument();
    expect(screen.queryByText("Rizky Pratama")).not.toBeInTheDocument();

    fireEvent.change(sessionSelect, { target: { value: "U10" } });
    expect(screen.getByText("Rizky Pratama")).toBeInTheDocument();
  });

  it("updates H/I/A totals and keeps unmarked players distinct from absent players", () => {
    render(<TrainingAttendancePage />);

    const summary = screen.getByRole("region", { name: "Ringkasan absensi" });
    expect(within(summary).getByText("Belum ditandai").parentElement).toHaveTextContent("8");
    expect(screen.getByText("0 dari 8 pemain ditandai")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Hadir · Rizky Pratama" }));
    fireEvent.click(screen.getByRole("button", { name: "Izin · Fajar Nugraha" }));
    fireEvent.click(screen.getByRole("button", { name: "Absen · Muh. Alif" }));

    expect(screen.getByText("3 dari 8 pemain ditandai")).toBeInTheDocument();
    expect(within(summary).getByText("Hadir").parentElement).toHaveTextContent("1");
    expect(within(summary).getByText("Izin").parentElement).toHaveTextContent("1");
    expect(within(summary).getByText("Absen").parentElement).toHaveTextContent("1");
    expect(within(summary).getByText("Belum ditandai").parentElement).toHaveTextContent("5");
  });

  it("keeps the existing completeness gate and provides a review with local-only confirmation", () => {
    render(<TrainingAttendancePage />);

    expect(screen.getByRole("button", { name: "Tandai 8 pemain lagi" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Semua hadir" }));
    expect(screen.getByRole("button", { name: "Tinjau draf" })).toBeEnabled();

    fireEvent.click(screen.getByRole("button", { name: "Tinjau draf" }));
    expect(screen.getByText("Draf absensi")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Konfirmasi demo lokal" }));

    expect(
      screen.getByText(/Demo attendance recorded locally for this page session/),
    ).toHaveTextContent("does not save attendance to the server");
  });

  it("requires reset confirmation and clears the selected session draft", () => {
    render(<TrainingAttendancePage />);

    fireEvent.click(screen.getByRole("button", { name: "Semua hadir" }));
    fireEvent.click(screen.getByRole("button", { name: "Reset draf" }));
    const dialog = screen.getByRole("alertdialog");
    expect(dialog).toHaveTextContent("Tidak ada data server yang akan diubah");

    fireEvent.click(within(dialog).getByRole("button", { name: "Reset draf" }));
    expect(screen.getByText("Draft reset. No server attendance was changed.")).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "Ringkasan absensi" })).toHaveTextContent("8");
  });

  it("shows explicit states for no sessions and sessions without a matching roster", () => {
    const { unmount } = render(<TrainingAttendancePage sessionsData={[]} rosterData={roster} />);
    expect(screen.getByText("Belum ada sesi latihan")).toBeInTheDocument();

    unmount();
    render(
      <TrainingAttendancePage
        sessionsData={[
          {
            ...sessions[0],
            team: "U99",
            time: "19.00–20.00",
            coach: "Coach Demo",
            place: "Lapangan Demo",
            plan: "Latihan demonstrasi",
          },
        ]}
        rosterData={roster}
      />,
    );
    expect(screen.getByText("Roster demonstrasi belum tersedia untuk U99")).toBeInTheDocument();
  });

  it("retains an in-page draft when changing sessions and returning", () => {
    render(<TrainingAttendancePage />);
    const sessionSelect = screen.getByLabelText("Pilih sesi latihan");

    fireEvent.click(screen.getByRole("button", { name: "Hadir · Rizky Pratama" }));
    fireEvent.change(sessionSelect, { target: { value: "U8" } });
    fireEvent.change(sessionSelect, { target: { value: "U10" } });

    expect(
      screen.getByText("Draft U10 tetap tersedia selama halaman ini terbuka."),
    ).toBeInTheDocument();
    expect(screen.getByText("1 dari 8 pemain ditandai")).toBeInTheDocument();
  });
});
