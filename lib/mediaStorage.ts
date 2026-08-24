import fs from 'fs';
import path from 'path';
import { db } from '@/lib/db';

/**
 * Safely removes an uploaded file from disk if and only if no other database record references it.
 * Bundled static assets (in /images, /partners, etc.) and remote URLs are never deleted.
 */
export async function cleanupOrphanedMedia(oldUrl?: string | null): Promise<boolean> {
  if (!oldUrl || typeof oldUrl !== 'string') return false;

  // Only manage dynamically uploaded files under /uploads/
  if (!oldUrl.startsWith('/uploads/')) {
    return false;
  }

  try {
    // Check if oldUrl is still referenced across all media-supporting tables
    const [
      siteSettingCount,
      skillCount,
      participantCount,
      eventCount,
      eventParticipantCount,
      eventMediaCount,
      storyCount,
      partnerCount,
      volunteerCount,
      galleryItemCount,
      testimonialCount,
    ] = await Promise.all([
      db.siteSetting.count({ where: { value: oldUrl } }),
      db.skill.count({
        where: {
          OR: [{ coverImage: oldUrl }, { videoUrl: oldUrl }],
        },
      }),
      db.participant.count({ where: { photoUrl: oldUrl } }),
      db.event.count({
        where: {
          OR: [{ coverImage: oldUrl }, { winnerPhoto: oldUrl }],
        },
      }),
      db.eventParticipant.count({ where: { photoUrl: oldUrl } }),
      db.eventMedia.count({ where: { url: oldUrl } }),
      db.story.count({ where: { coverImage: oldUrl } }),
      db.partner.count({ where: { logoUrl: oldUrl } }),
      db.volunteer.count({ where: { imageUrl: oldUrl } }),
      db.galleryItem.count({ where: { imageUrl: oldUrl } }),
      db.testimonial.count({ where: { image: oldUrl } }),
    ]);

    const totalReferences =
      siteSettingCount +
      skillCount +
      participantCount +
      eventCount +
      eventParticipantCount +
      eventMediaCount +
      storyCount +
      partnerCount +
      volunteerCount +
      galleryItemCount +
      testimonialCount;

    if (totalReferences === 0) {
      // Safe to physically delete the orphaned file from /public/uploads/
      const relativePath = oldUrl.startsWith('/') ? oldUrl.slice(1) : oldUrl;
      const absolutePath = path.join(process.cwd(), 'public', relativePath);

      // Security check: ensure path is within public/uploads/
      const expectedPrefix = path.join(process.cwd(), 'public', 'uploads');
      if (absolutePath.startsWith(expectedPrefix) && fs.existsSync(absolutePath)) {
        fs.unlinkSync(absolutePath);
        console.log(`[Media Cleanup] Successfully deleted orphaned file: ${oldUrl}`);
        return true;
      }
    } else {
      console.log(`[Media Cleanup] File ${oldUrl} is still referenced (${totalReferences} times). Skipping deletion.`);
    }

    return false;
  } catch (err) {
    console.error(`[Media Cleanup] Error verifying or deleting orphaned media ${oldUrl}:`, err);
    return false;
  }
}
