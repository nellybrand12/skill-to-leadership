import { db } from '@/lib/db';
import { defaultSettings, SiteSettingsMap } from '@/data/siteSettingsDefaults';

export { defaultSettings, type SiteSettingsMap };

/**
 * Server-side helper to fetch all dynamic site settings from Supabase with instant fallback
 */
export async function getSiteSettings(): Promise<SiteSettingsMap> {
  try {
    const settings = await db.siteSetting.findMany();
    const result: SiteSettingsMap = { ...defaultSettings };
    for (const s of settings) {
      if (s.value !== undefined && s.value !== null && s.value.trim() !== '') {
        result[s.key] = s.value;
      }
    }
    // Backward compatibility for old contact_phone key
    if (result['contact_phone'] && !result['contact_whatsapp']) {
      result['contact_whatsapp'] = result['contact_phone'];
    }
    // Auto-generate whatsapp link if missing
    if (!result['contact_whatsapp_link'] && result['contact_whatsapp']) {
      const cleanNumber = result['contact_whatsapp'].replace(/[^0-9]/g, '');
      result['contact_whatsapp_link'] = `https://wa.me/${cleanNumber}`;
    }
    return result;
  } catch (err) {
    console.error('Error fetching site settings from DB:', err);
    return { ...defaultSettings };
  }
}
