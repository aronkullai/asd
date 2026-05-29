export const siteConfig = {
  name: "PromoGuard",
  description:
    "Trust-first casino ratings, promo code tracking, and plain-English offer checks.",
  nav: [
    { href: "/", label: "Home" },
    { href: "/casinos", label: "Casinos" },
    { href: "/promos", label: "Promos" },
    { href: "/how-it-works", label: "How it works" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" }
  ],
  legalNav: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/how-it-works#responsible-gambling", label: "Responsible Gambling" },
    { href: "/how-it-works#affiliate-disclosure", label: "Disclosure" }
  ]
};

export const researcherConfig = {
  defaultCron: process.env.PROMO_RESEARCHER_CRON || "*/30 * * * *"
};
