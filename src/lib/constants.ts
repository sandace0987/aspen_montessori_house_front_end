// ===== Site-wide configuration =====
// Update these values to change contact details, links, and info across the entire site.

/** School name */
export const SCHOOL_NAME = "Aspen Montessori House";

/** Admissions Google Form URL */
export const ADMISSIONS_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfcaQiQ0bQcrYsAimGdg6TJGbZKS5RMev5Jy8cmb58be8Z_Mg/viewform?usp=dialog"; // TODO: Replace with actual URL

/** Primary contact phone number (display format) */
export const PHONE_NUMBER = "+91-7032000862";

/** Phone number digits only with country code (for tel: and WhatsApp links) */
export const PHONE_NUMBER_RAW = "917032000862";

/** WhatsApp number (digits only, with country code) — defaults to phone number */
export const WHATSAPP_NUMBER = PHONE_NUMBER_RAW;

/** Contact email */
export const EMAIL = "aspenmontessorihouse@gmail.com";

/** School address (single line) */
export const ADDRESS_SHORT = "Lanco Hills Private Rd, Manikonda, Hyderabad";

/** School address (full) */
export const ADDRESS_FULL =
  "Lanco Hills Private Rd, Sai Vaibhav Layout, Sai Aishwarya Layout, Chitrapuri Colony, Manikonda, Hyderabad, Telangana 500089";

/** Google Maps embed/link URL */
export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/AgRLa3BbKTZxHKe58";

/** Website URL (for SEO / canonical) */
export const SITE_URL = "https://aspenmontessori.in";

/** Summer Camp registration Google Form URL */
export const SUMMER_CAMP_FORM_URL = "https://forms.google.com/your-summer-camp-form"; // TODO: Replace with actual URL

/** Developer portfolio URL */
export const DEVELOPER_URL = "sandeep1407barik@gmail.com";

/** Instagram profile URL */
export const INSTAGRAM_URL = "https://www.instagram.com/aspen_montessori_house/";

/**
 * Backend API Parent Link (Base URL)
 * Reads dynamically from environment variables, falls back to development URL.
 */
export const API_PARENT_LINK =
  import.meta.env.VITE_API_PARENT_LINK ||
  "https://aspenmontessorihousebackend-development.up.railway.app";

/**
 * Supabase client configuration parameters.
 */
export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";


