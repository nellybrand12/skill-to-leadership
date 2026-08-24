# Skill to Leadership — Content, Asset & CMS Guide

This comprehensive reference document details the architecture, dynamic content keys, media storage lifecycles, and administration workflows of the **Skill to Leadership** platform.

---

## 1. Administrator Authentication & Access

Administrative access to the Skill to Leadership Management Portal (`/admin/login`):

* **Default Admin Accounts**:
  * `fonyechris@gmail.com`
  * `admin@skilltoleadership.org`
* **Default Password**: `password123`
* **Password Management**: Admins can change their login password directly from `/admin/settings` (under **Change Admin Login Password**). Passwords are encrypted with bcrypt (10 salt rounds) and stored securely in PostgreSQL.

---

## 2. Founder Profile & Safe Image Replacement Lifecycle

The Founder portrait and bio on the public website are completely CMS-driven.

* **Admin Portal Location**: `/admin/settings` (under **Founder Profile & Image**)
* **Dynamic Site Setting Keys**:
  * `founder_image`: Dynamic path to the active founder portrait (default: `/images/Founder.jpg`)
  * `founder_name`: Founder's full name (default: `Christopher Fonye`)
  * `founder_title`: Complete title string
  * `founder_quote`: Featured quotation rendered in the liquid-glass card
* **Credential Color Uniformity**: All 3 founder affiliation items (*Civil Engineering Student at Bucknell University*, *Ashinaga Africa Initiative Scholar*, and *Projects for Peace grantee*) share the exact same clean, cohesive styling (`text-xs text-gray-300`) with gold bullet icons.
* **Safe Media Replacement (`cleanupOrphanedMedia`)**:
  * When a new image is uploaded to `/public/uploads/founder/...`, the system verifies if the old image is stored under `/uploads/`.
  * The helper checks all media-holding tables (`SiteSetting`, `Skill`, `Participant`, `Event`, `EventParticipant`, `EventMedia`, `Story`, `Partner`, `Volunteer`, `GalleryItem`, `Testimonial`).
  * If the old file has 0 remaining references in the database, it is automatically unlinked from the server disk.
  * Static bundled assets (e.g. `/images/...`, `/partners/...`) and remote URLs are **never deleted**.

---

## 3. Homepage Introduction — 3 Evergreen Feature Pillars

Beneath the main hero introduction, 3 value proposition pillars are dynamically rendered from the database:

1. **Pillar 1**: `Practical Skills`
   * *Description*: Hands-on learning through real-world craft mastery
   * *Icon*: `Scissors` (Hairstyling & Craft)
   * *Settings Keys*: `feature_1_title`, `feature_1_desc`, `feature_1_icon`
2. **Pillar 2**: `Mentorship & Leadership`
   * *Description*: Personal growth and guidance beyond technical ability
   * *Icon*: `Compass` (Guidance & Purpose)
   * *Settings Keys*: `feature_2_title`, `feature_2_desc`, `feature_2_icon`
3. **Pillar 3**: `Community & Opportunity`
   * *Description*: Connecting ambitious youth with networks, toolkits and seed capital
   * *Icon*: `Users` (Community & Network)
   * *Settings Keys*: `feature_3_title`, `feature_3_desc`, `feature_3_icon`

* **How to Edit**: In `/admin/settings`, modify the titles, descriptions, and icon dropdown selections, then click **Save All Settings**.

---

## 4. Official Partners & Sponsors

All official partner organizations are database-driven via `model Partner` and fully manageable in `/admin/partners`.

| Partner Name | Category | Role / Description | Official Logo Asset |
| :--- | :--- | :--- | :--- |
| **Bucknell University** | Academic | Academic & Project Partner | `/partners/Bucknell.png` |
| **Projects for Peace** | Global Fellowship | Grantor & Global Peacebuilding Initiative | `/partners/Project-for-peace.png` |
| **Ashinaga** | Global Fellowship | Educational Foundation | `/partners/Ashinaga.png` |
| **Open Dreams** | Community | Community & Talent Partner | `/partners/Open-dreams.png` |
| **Gigi Nails** | Corporate / Studio | Industry & Nail Studio Partner | `/partners/Gigi-nails.png` |
| **Sakura** | Community / Artisan | Artisan & Cultural Partner | `/partners/Sakura.png` |

---

## 5. Entrepreneur Spotlight & Competition Lifecycle

The **Entrepreneurs Spotlight** (`/events/entrepreneurs-spotlight`) features dynamic visibility rules managed from `/admin/events`:

* **When Applications are OPEN (`status === 'ACTIVE'` or `applicationsEnabled === true`)**:
  * Displays the **"Apply Now"** button (linking directly to the Google Form / External URL).
  * Displays the **"Applications Open"** pulsing green badge.
  * **Hides** the Spotlight Archive, participant stories, and final winner to keep visitor attention focused on submitting applications.
* **When Applications are CLOSED (`status === 'CLOSED'` or `status === 'ARCHIVED'`)**:
  * Displays **`APPLICATION CLOSED`** badge.
  * Reveals the **Spotlight Archive & Participant Stories** grid.
  * Renders the **Grand Prize Winner Card** (100,000 FCFA Prize) *only if* the Admin has checked `hasWinner: true` and entered winner details (`winnerName`, `winnerPhoto`, `winnerBusiness`, `winnerStory`, `winnerQuote`).

---

## 6. Convergence Day 2 — Speaker Assets & Layout

* **Poster Asset**: `/images/convergence/convegence-2-speakers.jpg` (1080×1080 square format).
* **Uncropped Display**: Rendered inside an `aspect-square` container with `object-contain` so no faces or typography on the poster are ever cut off.
* **Keynote Speaker**: **Mr. Akaba James** (Director, Open Dreams).
* **Panel Discussion Speakers**:
  1. **Afopezi Moses** — Panelist (Technology, Digital Media & Youth Agency)
  2. **Serena Axelle** — Panelist (Creative Arts & Artisan Micro-Enterprise)
  3. **Moukam Jules** — Panelist (Youth Leadership & Strategic Execution)
  4. **Agbor Darren** — Panelist (Community Building & Entrepreneurial Resilience)

---

## 7. Liquid-Glass & Design System Tokens

* **Glow Policy**: Exaggerated fluorescent/neon ambient glows and harsh drop shadows have been removed in favor of refined liquid glass (`backdrop-filter: blur(18px)`), clean 1px borders (`rgba(255, 255, 255, 0.85)` / `border-neutral-border`), and subtle elevation shadows (`shadow-soft`, `shadow-elevated`).
* **Micro-Title Cleanup**: Redundant shining micro-title badges above `<h1>` and `<h2>` have been removed across all public pages (`/about`, `/programs`, `/cohorts`, `/impact`, `/events`, `/donate`, `/contact`, `/volunteer`, `/faq`), ensuring clean visual hierarchy.
* **Responsive Typography**:
  * Headings scale gracefully from `text-3xl` / `text-4xl` on mobile up to `lg:text-6xl` / `lg:text-7xl` on desktop.
  * Base mobile font-size smoothly adjusts to `15px` on screens below 640px.

---

## 8. Cache Revalidation & Dynamic Rendering

All public routes declare:
```typescript
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```
All admin mutation API endpoints (`/api/admin/settings`, `/api/admin/partners`, `/api/admin/gallery`, `/api/admin/events`, `/api/admin/skills`, `/api/admin/volunteers`, `/api/admin/testimonials`, `/api/admin/stories`) automatically call `revalidatePath('/', 'layout')` on every create, update, and delete operation.
