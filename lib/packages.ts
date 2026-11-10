export const PACKAGES = [
  {
    key: "airtel_unlimited",
    name: "Airtel Free Unlimited Internet Access",
    amount: 53000,
    tag: "MONTHLY",
    blurb:
      "Stay online 24/7 on Airtel network. No data cap. Instant activation after payment confirmation.",
  },
  {
    key: "premium_monthly",
    name: "Monthly Premium Files",
    amount: 5000,
    tag: "MONTHLY",
    blurb:
      "Full curated archive, updated every month. Delivered personally on WhatsApp after approval.",
  },
  {
    key: "premium_weekly",
    name: "Weekly Premium Files",
    amount: 1500,
    tag: "WEEKLY",
    blurb:
      "Same premium archive, weekly rotation. Perfect for short projects and quick drops.",
  },
] as const;

export type PackageKey = (typeof PACKAGES)[number]["key"];

export const phoneToEmail = (phone: string) => {
  const clean = phone.replace(/^\+/, "").replace(/\s+/g, "");
  return `${clean}@aamcashking1.app`;
};
