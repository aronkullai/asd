import { runPromoResearcherOnce } from "@/lib/promoResearcher";

const casinoSlug = process.argv[2];

runPromoResearcherOnce(casinoSlug)
  .then((results) => {
    console.log(JSON.stringify(results, null, 2));
  })
  .catch((error) => {
    console.error("[promoResearcher] One-off run failed", error);
    process.exitCode = 1;
  });
