# بطاركة حافظوا على الإيمان | Coptic Patriarchs Archive

أرشيف توثيقي لسير بطاركة الكنيسة القبطية الأرثوذكسية ودورهم في الحفاظ على الإيمان.

A documentary archive of Coptic Orthodox Patriarchs who preserved and defended the Christian faith.

## Features

- Browse patriarchs with beautiful cards
- Search by name (Arabic or English) or biography text
- Filter by century and sort by papal number, century, or name
- Detailed biography pages with timeline, events, sources, and "How He Preserved the Faith" section
- Historical timeline page showing all patriarchs chronologically
- About page explaining the project
- Admin dashboard (login required) to add, edit, and delete patriarchs, events, and sources
- Bilingual: Arabic (RTL) and English (LTR) with language switcher
- Responsive design for desktop, tablet, and mobile
- Built with React + TypeScript + Vite + Tailwind CSS + Supabase

## Tech Stack

- **React** + **TypeScript** — Frontend framework
- **Vite** — Build tool and dev server
- **Tailwind CSS** — Styling
- **Supabase** — Database (PostgreSQL) and Auth
- **react-router-dom** — Routing
- **lucide-react** — Icons

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up / log in
2. Click "New Project" and fill in the details
3. Wait for the project to be created

### 3. Create the Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` from this project
4. Paste it into the SQL editor and click **Run**
5. This creates three tables: `patriarchs`, `patriarch_events`, `patriarch_sources`

### 4. Add Environment Variables

1. In your Supabase dashboard, go to **Settings → API**
2. Copy your **Project URL** and **anon public key**
3. Create a `.env` file in the project root (copy from `.env.example`):

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Create an Admin User (for the admin dashboard)

1. In your Supabase dashboard, go to **Authentication → Users**
2. Click **Add User** and enter an email and password
3. Use these credentials to log in at `/admin`

### 6. Run Locally

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

### 7. Build for Production

```bash
npm run build
```

This creates a `dist/` folder with the production build.

### 8. Deploy to Vercel

1. Push your project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **New Project** and import your GitHub repository
4. In the environment variables section, add:
   - `VITE_SUPABASE_URL` = your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**
6. Your site will be live!

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── PatriarchCard.tsx
│   ├── PatriarchImage.tsx
│   ├── SearchBar.tsx
│   ├── FilterBar.tsx
│   ├── PatriarchTimeline.tsx
│   ├── EventTimeline.tsx
│   ├── SourceList.tsx
│   ├── LoadingState.tsx
│   ├── EmptyState.tsx
│   └── ErrorState.tsx
├── contexts/         # React contexts
│   └── LanguageContext.tsx
├── hooks/            # Custom hooks for data fetching
│   └── usePatriarchs.ts
├── lib/              # Configuration
│   └── supabase.ts
├── pages/            # Page components
│   ├── Home.tsx
│   ├── Patriarchs.tsx
│   ├── PatriarchDetails.tsx
│   ├── Timeline.tsx
│   ├── About.tsx
│   └── Admin.tsx
├── types/            # TypeScript type definitions
│   └── index.ts
├── App.tsx           # Main app with routing
├── main.tsx          # Entry point
└── index.css         # Global styles
```

## Notes

- This is an educational documentary project for a computer competition.
- Information is sourced from historical references including the History of the Patriarchs by Severus ibn al-Muqaffa, the Coptic Synaxarium, and ecumenical council records.
- Some dates are approximate (marked with "حوالي" / "circa") as exact historical dates are not always known.
- The database is pre-seeded with 10 well-known Coptic patriarchs. Admins can add more through the admin dashboard.
- Never expose the Supabase service role key in frontend code. Only use the anon key.
