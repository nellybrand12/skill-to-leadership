# Skill to Leadership — Complete Web Platform & Admin System

The official web platform, content management system (CMS), and administrative portal for **Skill to Leadership**, empowering Cameroonian youths through vocational mastery, creative arts, and entrepreneurship in Yaoundé, Cameroon.

---

## 🚀 Tech Stack & Core Architecture

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router with isolated Public and Admin route groups)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with Custom Liquid-Glass, Deep Navy, and Warm Gold Design System
- **Database & ORM**: [Prisma 7](https://www.prisma.io/) + [Supabase PostgreSQL](https://supabase.com/) with `@prisma/adapter-pg` connection pooling
- **Authentication**: JWT-based secure HTTP-only cookie sessions (`stl_admin_session`) and server-side `bcrypt` password hashing
- **Email Service**: [Nodemailer](https://nodemailer.com/) direct reply and notification engine
- **Deployment**: [Vercel](https://vercel.com/)

---

## 🏛️ Layout Architecture: Clean Public & Admin Separation

The application enforces total architectural separation between public visitor pages and the administrative dashboard:

```
app/
├── layout.tsx                    # Minimal Root: <html>, <body>, global styles, metadata
│
├── (public)/                     # PUBLIC WEBSITE (For Visitors & Fellows)
│   ├── layout.tsx                # Dedicated Public Layout (Navbar, PageTransition, Footer)
│   ├── page.tsx                  # Homepage
│   ├── about/                    # About, Founder, Staff, Philosophy
│   ├── programs/                 # Vocational tracks & dynamic [slug] pages
│   ├── cohorts/                  # Cohort 1 achievements & Cohort 2 countdown
│   ├── events/                   # Events listing & dynamic [slug] pages (Spotlight)
│   ├── donate/                   # External MoMo, Orange Money, and GoFundMe instructions
│   ├── contact/                  # Visitor inquiry form (saves to Supabase)
│   ├── volunteer/                # Volunteer & mentor applications
│   └── impact/                   # Outcomes, indicators, and graduation metrics
│
└── admin/                        # ADMINISTRATIVE PORTAL (Super Admin Console)
    ├── layout.tsx                # Dedicated Admin Layout (AdminSidebar, Admin Topbar, No Public Header/Footer)
    ├── login/                    # Secure Admin Login (No pre-filled or exposed credentials)
    ├── dashboard/                # Operational stats, live tracks, message counts
    ├── messages/                 # Super Admin Inbox & direct email replies to senders
    ├── events/                   # Event lifecycle, closing dates, participants, winners, media
    ├── cohorts/                  # Cohort cycles & Vocational Skills manager
    ├── gallery/                  # Photo gallery archive & cohort image uploader
    ├── partners/                 # Institutional supporters & footer logo manager
    ├── stories/                  # Blog & success stories editor
    ├── volunteers/               # Volunteer application reviewer
    ├── donations/                # Informational guide on external donation processing
    └── settings/                 # Global platform settings CMS
```

---

## 🗄️ Supabase PostgreSQL & Prisma 7 Database

The platform runs on **Supabase PostgreSQL** managed through Prisma 7 with driver adapters:

- **`prisma/schema.prisma`**: Defines data models for `Event`, `EventParticipant`, `EventMedia`, `Skill`, `Cohort`, `Participant`, `GalleryItem`, `Partner`, `ContactMessage`, `Volunteer`, `Story`, `SiteSetting`, and `User`.
- **`prisma.config.ts`**: Configures database connection string via `DIRECT_URL` and `DATABASE_URL`.
- **`lib/db.ts`**: PostgreSQL singleton with `pg.Pool` connection pooling.

### Key Database Management Commands:
```bash
# Generate Prisma Client
npx prisma generate

# Push schema changes to Supabase PostgreSQL
npx prisma db push

# Open visual database studio
npx prisma studio
```

---

## ⏱️ Real Event Lifecycle & Timezone Management

Events (including the **Entrepreneur Spotlight**) are dynamic, database-driven initiatives rather than static text:

### 1. Database Fields (`Event` Model)
- `startDateTime`: ISO Timestamp for when applications/registration opens.
- `endDateTime`: ISO Timestamp for automatic application cutoff.
- `isSpotlight`: Boolean flag designating an Entrepreneur Spotlight initiative.
- `applicationUrl`: External Google Form or portal URL.
- `winnerName`, `winnerBusiness`, `winnerPhoto`, `winnerStory`, `winnerQuote`, `winnerPrize`, `hasWinner`: Winner designation fields.
- `published`: Boolean publication toggle.

### 2. Timezone Handling & Status Calculation
- **Timezone**: Evaluated authoritatively in Cameroon local time (**`Africa/Douala`**, UTC+1) via [`lib/events.ts`](file:///home/kemcheki/Music/lib/events.ts).
- **Lifecycle Logic** (`getEventLifecycleStatus`):
  - `now < startDateTime` → **`UPCOMING`** ("Upcoming / Coming Soon")
  - `startDateTime <= now <= endDateTime` → **`ACTIVE`** ("Applications Open" + "Apply Now" button visible)
  - `now > endDateTime` → **`CLOSED`** ("APPLICATION CLOSED" red badge + "Apply Now" button automatically removed)

### 3. Entrepreneur Spotlight Transition Flow
```
1. Active Period (Before endDateTime)
   ├── Status Badge: "Applications Open" (Green)
   └── CTA: "Apply Now" (Links to external Google Form)

2. Automatic Closure (After endDateTime passes)
   ├── Status Badge: "APPLICATION CLOSED" (Red accent)
   ├── CTA: "Apply Now" button is removed automatically
   └── Event remains live as an archival initiative

3. Post-Closure Admin Additions (Via /admin/events)
   ├── Add Selected Participants & Stories (Displays "MEET THE ENTREPRENEURS")
   ├── Designate Final Grand Champion Winner (Displays prominent "WINNER" section)
   └── Upload Post-Event Highlight Media (Displays "EVENT HIGHLIGHTS" photo/video gallery)
```

---

## 🎨 Admin Management Workflows & Public Synchronization

All changes saved in the Admin console are saved to Supabase and immediately propagate to public pages (`force-dynamic` rendering):

| Admin Feature | Admin Path | Public Path Affected | Description |
| :--- | :--- | :--- | :--- |
| **Events & Spotlight** | `/admin/events` | `/events`, `/events/[slug]`, Homepage | Manages start/end dates, application URLs, stories, winners, and media highlights. |
| **Vocational Skills** | `/admin/cohorts` | `/programs`, `/programs/[slug]` | Creates and publishes skills (e.g. Photography). Dynamic routes automatically render new skills. |
| **Cohort Cycles** | `/admin/cohorts` | `/cohorts`, Homepage Banner | Manages cohort lifecycle (`DRAFT`, `COMING_SOON`, `ACTIVE`, `COMPLETED`, `ARCHIVED`). |
| **Photo Gallery** | `/admin/gallery` | Homepage Archive, `/cohorts` | Uploads images (up to 30MB) assigned to Cohort 1 Archive or Cohort 2. |
| **Partners & Logos** | `/admin/partners` | Website Footer (`Footer.tsx`) | Uploads logos and links. Public footer dynamically renders active partners. |
| **Messages Inbox** | `/admin/messages` | Internal Super Admin Inbox | Receives visitor submissions and sends replies directly to the original sender's email. |
| **Site Settings** | `/admin/settings` | Global Header, Hero, Footer | Modifies hero copy, contact info, social URLs, and Matthew 5:16 scripture quote. |

---

## 🔐 Admin Authentication & Security

- **Login Endpoint**: `/admin/login`
- **Security Rule**: No hardcoded credentials, demo hints, or passwords are displayed on the login screen.
- **Server Authorization**: [`lib/auth.ts`](file:///home/kemcheki/Music/lib/auth.ts) verifies JWT tokens stored in HTTP-only cookies and enforces `SUPER_ADMIN` role permissions across all admin pages and `/api/admin/*` routes.
- **Password Storage**: Strictly hashed using `bcrypt` (10 salt rounds).

---

## 💡 Important External Workflows Clarification

### 1. External Donations
- Skill to Leadership receives donations exclusively through external financial channels: **MTN Mobile Money**, **Orange Money**, and **GoFundMe**.
- Because transactions take place on external telecom networks, the admin dashboard does not display fake automated transaction ledgers or synthetic payment counts. `/admin/donations` provides an informational reference guide.

### 2. External Entrepreneur Spotlight Applications
- Entrepreneur Spotlight applications are submitted and reviewed externally via official Google Forms.
- The admin dashboard manages the event content, closing schedule, selected participant profiles, winner showcase, and media gallery without pretending to receive raw application submissions internally.

---

## ⚙️ Environment Variables

Configure `.env` with the following variables:

```env
DATABASE_URL="postgresql://postgres.[REF]:[PASS]@aws-1-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[REF]:[PASS]@aws-1-[REGION].pooler.supabase.com:5432/postgres"
JWT_SECRET="your_secure_random_jwt_secret_key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_ORG_NAME="Skill to Leadership"
NEXT_PUBLIC_CONTACT_EMAIL="fonyechris@gmail.com"
NEXT_PUBLIC_CONTACT_PHONE="+237 668 62 06 75"
NEXT_PUBLIC_LOCATION="Yaoundé, Cameroon"

# Optional Outbound SMTP Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="notifications@skilltoleadership.org"
SMTP_PASS="app-password"
```

---

## 🛠️ Local Development & Build Verification

```bash
# 1. Install dependencies
npm install

# 2. Generate Prisma client & sync database
npx prisma generate
npx prisma db push

# 3. Start local development server
npm run dev

# 4. Compile optimized production build
npm run build
```

---

## ☁️ Vercel Production Deployment

1. Connect the repository to [Vercel](https://vercel.com).
2. Configure the Environment Variables in **Project Settings > Environment Variables**.
3. Deploy! Vercel automatically runs `prisma generate && next build`.
