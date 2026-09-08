# BrightSteps — Family Rewards PWA

BrightSteps is a family-first task and rewards web app for parents and children. It supports points, EGP allowance tracking, screen-time rewards, custom rewards, task approval workflow, reward redemption, achievements, streaks, levels, English/Arabic with RTL, and a touch-friendly mobile-first interface.

Built as a **Progressive Web App (PWA)** — installable on Android Chrome via "Add to Home Screen" with offline support.

## Features

### Parent
- Create a family and add children
- Create tasks with categories, frequency, deadlines, difficulty, icons, and reward types
- Approve or reject completed tasks (rewards auto-granted on approval)
- Approve or reject reward redemption requests (points auto-deducted on approval)
- View family overview, child progress, and transaction history
- Manage family settings (notifications, language, appearance)

### Child
- View assigned tasks and complete them for parent approval
- Browse the reward store and request rewards
- View points, money balance, screen time, and streak
- Track XP, levels, and achievements
- View transaction history
- Switch between child profiles

### Core Workflow
1. Parent creates a task and assigns it to a child
2. Child completes the task → status becomes "Waiting for Approval"
3. Parent approves → reward (points/money/screen time) is automatically granted
4. Child's balance updates in real-time
5. Child opens Reward Store and requests a reward
6. Parent approves → points are deducted, transaction recorded in history

### Rewards
- **Points**: e.g. Clean room → +20 points
- **Money**: Parent-managed allowance only (no banking/payments)
- **Screen Time**: e.g. +30 minutes TV
- **Custom Rewards**: e.g. Ice cream, movie night, choose dinner

### Gamification
- XP and levels: Beginner → Helper → Super Helper → Family Hero → Champion
- Achievements: First Task, 10 Tasks, 7-Day Streak, Homework Hero, Reading Star, Helpful Family Member
- Progress bars and positive messaging (no guilt-based mechanics)

### Languages
- English and Arabic with full RTL support
- Language preference persists across sessions

### PWA
- Web App Manifest with standalone display mode
- Service Worker for offline shell caching
- Installable on Android Chrome via "Add to Home Screen"
- App icons (192px and 512px)
- Offline-friendly: cached data visible when disconnected

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Supabase** for database, auth, and row-level security
- **Tailwind CSS** for styling
- **Lucide React** for icons

## Database & Security

The Supabase database includes: families, children, tasks, task_completions, rewards, reward_redemptions, points_transactions, money_transactions, screen_time_transactions, achievements, child_achievements, notifications, and family_settings.

### Row-Level Security (RLS)
- Every table has RLS enabled
- Parents can only access their own family's data (verified via `families.created_by = auth.uid()`)
- Children cannot modify their own balance, approve tasks, or modify rewards
- Server-side `SECURITY DEFINER` functions handle task approval and reward redemption atomically, ensuring balance changes only happen through verified parent approval

## Local Development

```bash
npm install
npm run dev
```

The Supabase connection details are pre-configured in `.env`.

## Production Build

```bash
npm install
npm run build
```

The build output is in the `dist/` directory. The app can be deployed to any static hosting platform that supports HTTPS (required for service workers and PWA features).

## Deployment

### Option 1: Netlify
1. Run `npm run build`
2. Drag the `dist/` folder to Netlify's deploy dashboard
3. Or connect your Git repository and set build command to `npm run build` with publish directory `dist`

### Option 2: Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the project root
3. The build command and output directory are auto-detected

### Option 3: Any static host (Cloudflare Pages, GitHub Pages, etc.)
1. Run `npm run build`
2. Upload the contents of `dist/` to your hosting provider
3. Ensure HTTPS is enabled (required for service workers)

### Environment Variables
The following are pre-configured in `.env`:
- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Supabase anonymous key

No additional configuration is needed for deployment.

## Demo Mode

The app includes a "Try demo family" option on the welcome screen that loads sample data (Ahmed Family with children Adam and Jana, sample tasks and rewards) without requiring an account or database connection.
