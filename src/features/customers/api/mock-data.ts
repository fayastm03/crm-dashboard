import { Customer, CustomerStatus } from "../types/customer.types";

const FIRST_NAMES = [
  "Aarav", "Aditi", "Aditya", "Akash", "Akhil", "Ameya",
  "Ananya", "Anika", "Arjun", "Aryan", "Avinash", "Deepak",
  "Diya", "Gaurav", "Isha", "Karan", "Kavya", "Krishna",
  "Manish", "Meera", "Neha", "Nikhil", "Pooja", "Pranav",
  "Rahul", "Riya", "Rohan", "Sanjay", "Shreya", "Sneha",
  "Suresh", "Tanvi", "Varun", "Vikram", "Yash", "Zoya",
];

const LAST_NAMES = [
  "Nair", "Menon", "Pillai", "Iyer", "Rao", "Sharma",
  "Patel", "Gupta", "Singh", "Kumar", "Reddy", "Nair",
  "Das", "Mishra", "Joshi", "Mehta", "Shah", "Verma",
  "Bhat", "Shetty",
];

const COMPANIES = [
  "Tata Consultancy Services",
  "Infosys",
  "Wipro",
  "HCL Technologies",
  "Tech Mahindra",
  "Reliance Industries",
  "Larsen & Toubro",
  "Hindustan Unilever",
  "ICICI Bank",
  "HDFC Bank",
];

/**
 * Indian cities used for mock customer data.
 */
const CITIES = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kochi",
  "Mangaluru",
  "Kolkata",
  "Ahmedabad",
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

/** Simple seeded PRNG so the dataset is identical on every run. */
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

/**
 * Generates an Indian-style mobile number.
 * Example: +91 98765 43210
 */
function generateIndianPhone(): string {
  const prefixes = [
    "6",
    "7",
    "8",
    "9",
  ];

  const firstDigit = pick(prefixes);

  const remainingDigits = Math.floor(
    100000000 + rand() * 900000000
  ).toString();

  const number = firstDigit + remainingDigits.slice(0, 9);

  return `+91 ${number.slice(0, 5)} ${number.slice(5)}`;
}

function generateCustomer(index: number): Customer {
  const first = pick(FIRST_NAMES);
  const last = pick(LAST_NAMES);
  const company = pick(COMPANIES);
  const city = pick(CITIES);

  const status: CustomerStatus =
    rand() > 0.35 ? "active" : "inactive";

  const createdDate = randomDateWithinLastYears(3);

  // Last contact is always on/after created date
  const lastContactDate = new Date(
    new Date(createdDate).getTime() +
      rand() *
        (Date.now() - new Date(createdDate).getTime())
  ).toISOString();

  const emailFirst = first
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const emailLast = last
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  const companyDomain = company
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

  return {
    id: `cust_${String(index + 1).padStart(4, "0")}`,

    name: `${first} ${last}`,

    email: `${emailFirst}.${emailLast}${index}@${companyDomain}.com`,

    phone: generateIndianPhone(),

    company,

    status,

    lastContactDate,

    createdDate,

    notes: `${city} - ${pick(NOTES_SAMPLES)}`,
  };
}

export const MOCK_CUSTOMERS: Customer[] = Array.from(
  { length: 150 },
  (_, i) => generateCustomer(i)
);

export const AVAILABLE_COMPANIES = COMPANIES;