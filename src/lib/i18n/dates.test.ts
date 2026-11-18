import { describe, expect, it } from "vitest";

import {
  formatDate,
  formatDay,
  formatMonthName,
  formatPeriod,
  monthsBetween,
  splitMonths,
} from "./dates";

describe("formatDate", () => {
  it("formats month and year per locale", () => {
    expect(formatDate("2025-07-01", "en", "month")).toBe("Jul 2025");
    expect(formatDate("2025-08-15", "id", "month")).toBe("Agu 2025");
  });

  it("can show only the year", () => {
    expect(formatDate("2022-09-01", "en", "year")).toBe("2022");
  });
});

describe("formatPeriod", () => {
  it("joins start and end", () => {
    expect(formatPeriod("2025-08-01", "2025-12-31", "en", "Present")).toBe("Aug 2025 – Dec 2025");
  });

  it("uses the present label for ongoing entries", () => {
    expect(formatPeriod("2026-07-01", null, "id", "Sekarang")).toBe("Jul 2026 – Sekarang");
  });
});

describe("monthsBetween and splitMonths", () => {
  it("counts both the first and the last month", () => {
    expect(monthsBetween("2025-08-01", "2025-12-31")).toBe(5);
    expect(monthsBetween("2025-08-01", "2025-08-20")).toBe(1);
  });

  it("splits months into years and months", () => {
    expect(splitMonths(14)).toEqual({ years: 1, months: 2 });
    expect(splitMonths(5)).toEqual({ years: 0, months: 5 });
  });
});

describe("formatDay and formatMonthName", () => {
  it("formats a full day and a month name", () => {
    expect(formatDay("2026-11-18", "en")).toBe("Nov 18, 2026");
    expect(formatDay("2026-11-18", "id")).toBe("18 Nov 2026");
    expect(formatMonthName("2026-01-05", "en")).toBe("Jan");
  });
});
