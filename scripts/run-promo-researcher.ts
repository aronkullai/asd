import cron from "node-cron";
import { getPromoResearcherSchedule, runPromoResearcherOnce } from "@/lib/promoResearcher";

const schedule = getPromoResearcherSchedule();

console.log(`[promoResearcher] Starting scheduled job with cron "${schedule}"`);

cron.schedule(schedule, async () => {
  try {
    await runPromoResearcherOnce();
  } catch (error) {
    console.error("[promoResearcher] Scheduled run failed", error);
  }
});
