-- CourseForge demo seed: 3 complete courses with real lesson content.
-- Re-runnable: clears previous seed rows first (cascades to modules/lessons/progress).
-- Run AFTER supabase/migrations/001_courseforge.sql in the Supabase SQL editor.

delete from cf_courses where slug in (
  'nextjs-16-foundations',
  'supabase-in-practice',
  'freelancing-with-ai-tools'
);

-- ── Courses ──────────────────────────────────────────────────────────────
insert into cf_courses (title, slug, description, thumbnail_emoji, level, price_cents) values
(
  'Next.js 16 Foundations',
  'nextjs-16-foundations',
  $$Learn Next.js 16 from zero: routing, server components, data fetching, and deployment. Build real features from your very first lesson and finish with a live portfolio-ready app.$$,
  '⚡',
  'beginner',
  4900
),
(
  'Supabase in Practice',
  'supabase-in-practice',
  $$Go beyond the basics: Row Level Security, auth, storage, realtime and edge functions — everything you need to ship production-grade Supabase backends with confidence.$$,
  '🗄️',
  'intermediate',
  7900
),
(
  'Freelancing with AI Tools',
  'freelancing-with-ai-tools',
  $$Position yourself, deliver faster with AI without lowering quality, price with confidence, and write profiles and proposals that actually convert into paying clients.$$,
  '💼',
  'beginner',
  3900
);

-- ── Modules ──────────────────────────────────────────────────────────────
insert into cf_modules (course_id, title, position) values
((select id from cf_courses where slug = 'nextjs-16-foundations'), 'Getting Started', 0),
((select id from cf_courses where slug = 'nextjs-16-foundations'), 'Building Real Features', 1),
((select id from cf_courses where slug = 'supabase-in-practice'), 'Database & Auth', 0),
((select id from cf_courses where slug = 'supabase-in-practice'), 'Going Further', 1),
((select id from cf_courses where slug = 'freelancing-with-ai-tools'), 'Winning Clients in the AI Era', 0);

-- ── Course 1: Next.js 16 Foundations ─────────────────────────────────────
insert into cf_lessons (module_id, course_id, title, content, duration_minutes, position, is_free_preview) values
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 0),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'What Is Next.js and Why It Matters',
  $$Next.js is a React framework built by Vercel that gives you a complete toolkit for production web apps: routing, data fetching, rendering strategies, and deployment — all with sensible defaults so you stop wiring boilerplate and start shipping features.

The core idea is simple: React alone is a UI library. It doesn't tell you how to structure pages, fetch data, or handle SEO. Next.js answers all of that. You get file-based routing (a file becomes a URL), server-side rendering out of the box, and image, font, and script optimizations that would take weeks to build yourself.

Why it matters for your career: Next.js is the default choice for serious React work. Startups pick it for MVPs because one developer can ship a full product; agencies pick it because clients get fast, SEO-friendly sites. Learning it well is one of the highest-leverage investments a web developer can make.

In this course you'll build real features from lesson one — no toy examples. By the end you'll have an app you can deploy to a public URL and show in your portfolio. Let's start by getting your first app running.$$,
  8, 0, true
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 0),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Your First App with create-next-app',
  $$The fastest way to start is the official scaffolder. Make sure you have Node.js 20 or newer installed, then run the create command in your terminal and answer the prompts: TypeScript yes, ESLint yes, Tailwind CSS yes, App Router yes. These defaults match what professional teams use.

What you get is a working project: an app directory with a homepage, a layout file, global styles, and a development server. Run the dev command and open localhost:3000 — you'll see the starter page. That page is just a React component in app/page.tsx. Edit its text, save, and watch the browser update instantly. That fast feedback loop is your home base for the rest of this course.

Take two minutes to explore the project structure. The app folder is your router — every folder with a page.tsx becomes a route. The layout.tsx wraps every page (perfect for navbars). The public folder holds static assets like images. Understanding this map now saves you confusion later.

Common first-day gotcha: if the dev server won't start, it's almost always a Node version issue or a port conflict. Check your Node version, kill anything on port 3000, and reinstall dependencies with a fresh install. Don't lose an hour to environment issues — ask for help early.$$,
  12, 1, true
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 0),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'App Router: Pages, Layouts and Routing',
  $$The App Router (in the app directory) is how modern Next.js organizes pages. A route is a folder; the UI is page.tsx inside it. So app/about/page.tsx renders at /about, and app/blog/[slug]/page.tsx renders any /blog/anything with the slug available as a parameter. Nested folders create nested URLs automatically.

Layouts are the secret weapon. A layout.tsx in a folder wraps every page beneath it — put your navbar and footer in app/layout.tsx once and every page inherits them. Unlike pages, layouts don't re-render on navigation, so state (like a sidebar toggle) persists as users move around. This one concept replaces entire routing libraries.

Dynamic segments use square brackets: [id], [...slug] for catch-alls. Need a loading state? Add loading.tsx next to page.tsx and Next.js shows it automatically during navigation. Need a 404? not-found.tsx. These file conventions mean less code and more consistency across your app.

Try it now: create app/courses/page.tsx with a simple heading, visit /courses, then add app/courses/[slug]/page.tsx that reads the slug from params and displays it. In five minutes you'll understand routing better than any tutorial can teach.$$,
  15, 2, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 0),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Server Components vs Client Components',
  $$This is the most important mental model in modern Next.js. By default, every component is a Server Component: it renders on the server, ships zero JavaScript for itself, and can directly access databases and APIs. It's fast and secure — your database credentials never reach the browser.

You opt into Client Components with the 'use client' directive at the top of a file — and only when you need interactivity: click handlers, useState, useEffect, browser APIs. The rule of thumb: keep everything on the server by default, and push 'use client' as deep into the component tree as possible. A page can be a Server Component that renders one small Client Component for the interactive widget.

Beginners usually make one of two mistakes: marking everything 'use client' (losing all the performance benefits), or trying to use useState in a Server Component (which errors). When you see that error, don't fight it — extract the interactive part into its own client component file.

Think of it as a spectrum, not a war. Server Components fetch and render; Client Components interact. Master this split and you'll write Next.js apps that are both fast and rich — which is exactly what clients pay for.$$,
  14, 3, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 1),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Fetching Data on the Server',
  $$In the App Router, data fetching happens in Server Components with plain async/await — no useEffect, no loading spinners wired by hand. Your page component can be async: fetch from your database or API at the top, then render. The HTML arrives with data already in it, which is great for both speed and SEO.

Next.js caches fetch requests by default, which surprises people. For data that changes (a dashboard, a feed), opt out with cache: 'no-store' or use revalidation: export const revalidate = 60 to refresh every minute. Static marketing pages stay cached and lightning-fast; dynamic pages stay fresh. You choose per route.

Fetch in parallel when you can: start both requests before awaiting either (Promise.all), so a page needing user data plus orders doesn't wait twice. And fetch at the component level that needs the data — Next.js dedupes identical requests automatically, so you don't need prop drilling or global stores for server data.

Error handling matters: throw from your fetch and the nearest error.tsx boundary catches it, showing a friendly fallback instead of a white screen. Build this habit now — production apps are judged by how gracefully they fail.$$,
  16, 0, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 1),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Server Actions: Mutations Without an API',
  $$Server Actions let your forms and buttons call server code directly — no API routes, no fetch boilerplate. Mark a function with 'use server', call it from a Client Component, and Next.js handles the network round-trip. A contact form becomes a form with an action prop pointing at your function.

The killer pattern is progressive enhancement: use the HTML form action attribute and your form works even with JavaScript disabled, then add useFormStatus for pending states. You get resilient UX almost for free — something that used to require careful engineering.

Always validate on the server, even with client-side validation in place. Use a schema library like Zod to parse FormData and return structured errors. After a successful mutation, call revalidatePath to refresh the affected pages so the UI reflects the new data immediately.

When NOT to use Server Actions: for third-party webhooks, for logic other services need to call, or for anything requiring custom HTTP behavior — that's what Route Handlers (API routes) are for. Actions for your own UI mutations, routes for everything else.$$,
  15, 1, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 1),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Styling with Tailwind CSS',
  $$Tailwind is utility-first CSS: instead of writing custom classes, you compose small utilities directly in your JSX — flex, gap-4, text-lg, bg-blue-600. It feels verbose at first, then it clicks: you style at the speed you think, and you never context-switch to a stylesheet.

The real power is the design system in your config: define your brand colors, fonts, and spacing once in the theme, then use them everywhere as utilities. Consistency becomes automatic. Add dark mode with the dark: variant — one class prefix and your whole app adapts.

Keep components readable: extract repeated utility combos into small components (a Button, a Card) rather than copying long class strings. Tailwind plus components gives you both speed and maintainability — the best of both worlds.

Responsive design is built in: prefix any utility with sm:, md:, lg: to apply it at breakpoints. Design mobile-first (base styles for phones), then enhance upward. Your course project will look professional on every device with surprisingly little effort.$$,
  12, 2, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'nextjs-16-foundations' and m.position = 1),
  (select id from cf_courses where slug = 'nextjs-16-foundations'),
  'Deploying to Vercel',
  $$Deployment is where Next.js shines brightest. Push your code to GitHub, import the repo in Vercel, and you get a production URL in about a minute — with the framework preset auto-detected. Every push after that redeploys automatically; every pull request gets its own preview URL.

Environment variables are the main thing to get right: add them in the Vercel dashboard under Settings, with separate values for production and preview. Never commit secrets to git. If your app builds locally but fails on Vercel, missing env vars are the cause nine times out of ten.

Before you deploy, run the production build locally. This catches the class of errors that only appear in production builds, like using browser APIs during prerendering. Fix them locally where iteration is fast.

Your deployed URL is now a portfolio asset. Link it in your profiles, your resume, your proposals. Clients don't read code — they click links. A live, fast app beats a hundred lines of description.$$,
  10, 3, false
);

-- ── Course 2: Supabase in Practice ───────────────────────────────────────
insert into cf_lessons (module_id, course_id, title, content, duration_minutes, position, is_free_preview) values
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 0),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Projects, Tables and the SQL Editor',
  $$Every Supabase project is a real Postgres database with a generous free tier — not a toy. When you create a project you get a database, an API layer, auth, and storage, all wired together. The dashboard's Table Editor lets you create tables visually, but professionals learn the SQL editor too, because migrations and complex queries live there.

Design your tables like a backend engineer: uuid primary keys defaulting to gen_random_uuid(), timestamptz created_at columns, foreign keys with on delete cascade where it makes sense. Good schema design up front prevents painful migrations later — spend the hour here.

The SQL editor is also your debugging superpower. Slow page? Run the query with EXPLAIN ANALYZE. Weird data? Query it directly instead of guessing through your app code. The developers who reach for SQL first solve backend problems in minutes.

One warning: the dashboard is convenient, but every schema change you make by clicking should also exist as a migration file in your repo. Click-ops without migrations means your staging and production databases drift apart — and that's how outages happen.$$,
  12, 0, true
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 0),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Row Level Security, Explained Properly',
  $$Row Level Security is the single most important Supabase concept, and the most misunderstood. RLS means the database itself decides which rows a user can see — not your app code. When enabled, every query is filtered by policies you write. No policy allows access? The query returns nothing. This is security at the data layer, where it belongs.

The mental model: for each table you write policies like "users can read their own profile" (auth.uid() = user_id) or "anyone can read published posts" (is_published = true). Policies combine with OR within the same operation — if any policy allows it, access is granted. Think in terms of who and what, one policy per rule.

The classic beginner trap: enabling RLS and writing zero policies, then wondering why all queries return empty. RLS denies by default — that's the point. The second trap: writing policies that work for reading but forgetting INSERT, UPDATE and DELETE need their own policies too.

Test your policies as different users, not just as yourself. Create a second test account and verify it can't see what it shouldn't. RLS done right is the difference between a demo and a production system — and it's a genuine selling point to clients who care about security.$$,
  18, 1, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 0),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Auth: Email, OAuth and Sessions',
  $$Supabase Auth handles the hard parts: password hashing, session tokens, refresh flows, email templates. You configure providers in the dashboard and call signUp and signIn from the client library. The session lives in cookies (for SSR frameworks) or localStorage, and the client refreshes it automatically.

For OAuth (Google, GitHub), you register your app with the provider, paste the client ID and secret into Supabase, and add the redirect URL. The flow is: user clicks "Sign in with Google", goes to the provider, comes back to your app's callback, and the session is created. Test the full loop in an incognito window — cached sessions hide broken redirects.

Protecting pages has two layers: middleware that refreshes the session and redirects anonymous users away from private routes, and RLS policies that protect the data even if someone bypasses your UI. Never rely on UI hiding alone — the data layer is the real gate.

Magic links (passwordless email login) convert better than passwords for many products and eliminate an entire class of credential problems. Whatever method you choose, handle the edge cases: expired links, already-used tokens, and users who sign up twice. Auth is where users decide whether they trust your product.$$,
  15, 2, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 0),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Storage Buckets and Access Policies',
  $$Supabase Storage is S3-like object storage with the same RLS model as the database — buckets have policies controlling who can upload, read, and delete. Create separate buckets for separate concerns: avatars (public read, user-scoped write), documents (private), and so on.

The standard avatar pattern: a public bucket, upload path prefixed by user id (avatars/{user_id}/photo.png), and policies allowing authenticated users to write only under their own prefix. Public read means you can hotlink the file URL directly in an img tag — no signed URLs needed.

For private files, generate signed URLs with an expiry — the client requests a short-lived URL from your server, downloads the file, and the link dies. This is how you serve invoices, contracts, or user uploads without making them world-readable.

Watch your limits: the free tier includes storage and egress caps. Optimize images before upload (resize client-side), and set up cleanup jobs for temporary files. Storage bills surprise people who treat buckets as infinite.$$,
  12, 3, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 1),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Realtime Subscriptions',
  $$Realtime turns Postgres changes into live UI updates over websockets. Enable replication on a table, subscribe from the client with a filter (for example, messages for one chat room), and inserts, updates and deletes stream to every subscriber. Chat apps, live dashboards, and collaborative tools are the classic use cases.

The critical detail: Realtime respects RLS. A client only receives events for rows it can read — so your realtime subscriptions are as secure as your policies. Design the policies first, then subscribe; the security model composes cleanly.

Subscribe narrowly. A filter like room_id equals 42 keeps traffic tiny; subscribing to an entire table in a busy app will melt your users' browsers and your quota. Unsubscribe when components unmount — leaked subscriptions are the realtime equivalent of memory leaks.

Have a fallback: if the socket drops, your UI should degrade to polling or show a reconnecting state, not freeze silently. Realtime is a feature, not a foundation — build the app to work without it, then make it delightful with it.$$,
  14, 0, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 1),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Edge Functions',
  $$Edge Functions are TypeScript functions that run on Deno at the edge, close to your users — perfect for webhooks, third-party API integrations, and anything needing secrets your client should never see. They deploy with one CLI command and scale to zero when idle.

The canonical use case is the Stripe webhook: Stripe calls your function, you verify the signature with the webhook secret, and update the subscription row in the database with the service-role client. Secrets stay server-side, the client never touches them. This pattern generalizes to any provider webhook.

Keep functions small and single-purpose. Cold starts are fast but not free, so avoid heavy imports at the top level, and set explicit timeouts on outbound fetch calls. Log structured output — debugging a function you can't attach to requires good logs.

CORS trips everyone up once: browser-called functions need the right Access-Control headers, and preflight OPTIONS requests must be handled. Copy the CORS boilerplate from the docs, understand what each header does, and move on — it's a rite of passage, not a research project.$$,
  16, 1, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 1),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'Backups, Branching and Recovery',
  $$The free tier includes daily backups with limited retention; paid plans extend it. Know your recovery point objective before you need it: how much data can you afford to lose? For a side project, a day is fine. For paying customers, it isn't — plan accordingly.

Branching (on paid plans) gives you a disposable copy of production for testing migrations — run the scary ALTER TABLE against the branch first, verify the app still works, then apply to production with confidence. This single habit prevents the most common cause of self-inflicted downtime.

Practice a restore before you need one. The steps are documented, but doing them under calm conditions teaches you the timing, the gotchas, and what point-in-time recovery actually restores (data, not necessarily storage files — know the difference).

Beyond platform backups, export what matters: a nightly dump of critical tables to your own storage is cheap insurance. Backups you haven't tested are just hopes. Test them.$$,
  10, 2, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'supabase-in-practice' and m.position = 1),
  (select id from cf_courses where slug = 'supabase-in-practice'),
  'The Production Checklist',
  $$Before you call it production, walk this list: RLS enabled on every table with tested policies, no service-role key in client code, auth redirect URLs locked to your domains, storage buckets private except where intentionally public, and backups verified.

Performance: add indexes on every foreign key and every column you filter or sort by — check with EXPLAIN on your slowest pages. Enable connection pooling if you have serverless functions opening many connections. Open the query performance advisor in the dashboard and actually read it monthly.

Observability: log edge function errors somewhere you'll see them, set up alerts for failed backups and auth anomalies, and keep a status page (even a simple one) so users aren't guessing during incidents. You can't fix what you can't see.

Finally, document the runbook: how to rotate a leaked key, how to restore from backup, who gets paged. Production isn't a deployment — it's a commitment to operate. Clients pay premiums to developers who understand that difference.$$,
  12, 3, false
);

-- ── Course 3: Freelancing with AI Tools ──────────────────────────────────
insert into cf_lessons (module_id, course_id, title, content, duration_minutes, position, is_free_preview) values
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'freelancing-with-ai-tools' and m.position = 0),
  (select id from cf_courses where slug = 'freelancing-with-ai-tools'),
  'Positioning Yourself When AI Writes Code',
  $$Here's the uncomfortable truth: clients can now generate a landing page themselves in an afternoon. If your pitch is "I write code," you're competing with a free tool. Your pitch has to be "I ship working products" — judgment, integration, debugging, and accountability. AI writes code; you deliver outcomes.

Positioning means picking a lane and owning it. "Full-stack developer" is invisible. "I fix broken AI-generated apps and take them to production" is memorable — it's specific, it names a pain, and it implies a before-and-after story. Your niche should be narrow enough to remember and broad enough to pay.

Your proof has to be visible: live links, not screenshots. A client clicking a working demo in your proposal decides in thirty seconds. Build in public, keep your demos live, and make every project page answer one question: what did this person actually ship?

The developers thriving right now aren't the ones who ignored AI or the ones who surrendered to it — they're the ones who treat it as leverage. Your value moved up the stack: from typing code to architecting, verifying, and owning results. Price accordingly.$$,
  10, 0, true
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'freelancing-with-ai-tools' and m.position = 0),
  (select id from cf_courses where slug = 'freelancing-with-ai-tools'),
  'Delivering 3x Faster Without Lowering Quality',
  $$AI makes you faster at the parts that used to eat your week: scaffolding, boilerplate, first drafts of components, test cases. The workflow that works: you design the architecture, AI generates the bulk, you review everything like a senior reviewing a junior's pull request. Speed comes from the generation; quality comes from the review.

Never ship AI output you haven't read. The models are confident and occasionally wrong — subtly wrong, in ways that pass a glance and fail in production. Your checklist for every AI-generated chunk: does it handle errors, does it handle empty states, are the types honest, would I defend this in a code review?

Build a personal library of prompts and patterns for your stack — your playbook. The tenth form you build with AI should take minutes because your prompts already encode your standards. Leverage compounds; people starting from zero every time can't compete.

Tell clients about the speedup and keep the quality bar visibly high: fast delivery plus clean code plus tests. That's the combination that earns five-star reviews and repeat work. Speed without quality is just faster disappointment.$$,
  14, 1, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'freelancing-with-ai-tools' and m.position = 0),
  (select id from cf_courses where slug = 'freelancing-with-ai-tools'),
  'Pricing AI-Assisted Work',
  $$The biggest pricing mistake right now is charging less "because AI did half the work." Clients don't pay for your keystrokes — they pay for the working product, the risk you absorb, and the weeks you save them. Price the outcome, not the effort. If anything, faster delivery is worth more, not less.

That said, use your efficiency strategically. On a fixed-price project, AI leverage is pure margin — quote the market rate and deliver in half the time. On hourly work, your higher throughput justifies a higher rate: you're not selling hours, you're selling output per hour.

Never itemize an "AI discount" on an invoice. It anchors the client to the idea that your work is cheap to produce, and they'll expect the discount forever. Your costs are your business; the price reflects value delivered.

For your first reviews on a new platform, it's fine to price below market temporarily — that's a deliberate customer-acquisition cost, not your worth. Get ten five-star reviews, then raise to standard rates. The developers stuck at low prices are the ones who never planned the raise.$$,
  12, 2, false
),
(
  (select m.id from cf_modules m join cf_courses c on c.id = m.course_id where c.slug = 'freelancing-with-ai-tools' and m.position = 0),
  (select id from cf_courses where slug = 'freelancing-with-ai-tools'),
  'Profiles and Proposals That Convert',
  $$Your profile has about eight seconds. The title must say what you do for whom: "I fix broken AI-generated apps and ship them to production" beats "Full-stack developer" every time. The first two lines of your overview are the most-read text you'll ever write — lead with the client's problem, not your biography.

Portfolio beats promises. Three live links with one-line outcome descriptions outperform three paragraphs of skills. If you don't have client work yet, build demo projects that look like client work — real features, real data, deployed URLs.

Proposals: the first two sentences decide everything. Reference something specific from their job post (proves you read it), name the approach in one line (proves you can do it), and end with one clear question (starts a conversation). Ten tailored proposals beat a hundred templates.

Follow up once, politely, after a few days — many contracts go to the second message, not the first. And track what works: which titles get clicks, which openers get replies. Freelancing is a sales process; treat it like one and your win rate compounds.$$,
  15, 3, false
);
