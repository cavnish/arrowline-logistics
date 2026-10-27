/**
 * Static build-time content layer.
 * These exports come from the source data files (servicesData.ts, logisticsData.ts)
 * and are embedded at build time. They replace all runtime fetch() / axios calls
 * to Supabase / Express APIs for public page rendering.
 */
export { getAllMainServices, getMainServiceBySlug, getSubServiceBySlug } from "../servicesData";
export { COMPANY_DETAILS, TEAM_MEMBERS } from "../logisticsData";
