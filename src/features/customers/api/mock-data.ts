import { Customer, CustomerStatus } from "../types/customer.types";

const FIRST_NAMES = [
  "Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ivan", "Julia", "Kevin", "Laura", "Marcus", "Nina", "Omar", "Priya",
  "Quinn", "Rosa", "Sam", "Tara", "Umar", "Vera", "Will", "Xena", "Yusuf", "Zoe",
];

const LAST_NAMES = [
  "Green", "Ross", "Davis", "Baves", "Henderson", "Chen", "Patel", "Kim",
  "Nguyen", "Garcia", "Müller", "O'Brien", "Silva", "Ivanov", "Tanaka",
  "Okafor", "Reyes", "Novak", "Andersen", "Fischer",
];

const COMPANIES = [
  "Acme Corp", "Globex", "Stark Industries", "Innovatech", "Initech",
  "Umbrella Corp", "Wayne Enterprises", "Hooli", "Soylent Corp", "Cyberdyne",
];

const NOTES_SAMPLES = [
  "Met at industry conference. Discussed Q4 roadmap. Follow-up scheduled.",
  "Sent proposal, awaiting response.",
  "Very engaged in last call, interested in enterprise tier.",
  "Requested a pricing breakdown via email.",
  "Renewal conversation went well, low churn risk.",
  "No response after two follow-ups — may need to re-engage.",
  "",
];

/** Simple seeded PRNG so the dataset is identical on every run (no Math.random drift). */
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(42);

function pick<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}

function randomDateWithinLastYears(years: number): string {
  const now = Date.now();
  const past = now - years * 365 * 24 * 60 * 60 * 1000;
  const t = past + rand() * (now - past);
  return new Date(t).toISOString();
}

function generateCustomer(index: number): Customer {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const company = pick(COMPANIES);
  const status: CustomerStatus = rand() > 0.35 ? "active" : "inactive";
  const createdDate = randomDateWithinLastYears(3);
  // last contact is always on/after created date
  const lastContactDate = new Date(
    new Date(createdDate).getTime() +
      rand() * (Date.now() - new Date(createdDate).getTime())
  ).toISOString();

  return {
    id: `cust_${String(index + 1).padStart(4, "0")}`,
    name: `${first} ${last}`,
    email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@${company
      .toLowerCase()
      .replace(/\s+/g, "")}.com`,
    phone: `+1 (555) ${String(100 + Math.floor(rand() * 900)).slice(
      0,
      3
    )}-${String(1000 + Math.floor(rand() * 9000)).slice(0, 4)}`,
    company,
    status,
    lastContactDate,
    createdDate,
    notes: pick(NOTES_SAMPLES),
  };
}

export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 150 }, (_, i) =>
  generateCustomer(i)
);

export const AVAILABLE_COMPANIES = COMPANIES;
