# Noxtm Studio

Marketing website + admin panel for **Noxtm Studio**, a product design studio.
Dark, modern layout inspired by the structure of conference/studio sites, with
original Noxtm branding and content.

- **client/** — React + Vite + Tailwind (public site + admin panel)
- **server/** — Node + Express + MongoDB (REST API + JWT auth)

## Features

**Public site** (`/`)
- Home: hero, stats, services, team, testimonials, latest posts, CTA band
- About, Services, Work, Blog (list + post), Events, Contact (lead form)
- Floating chatbot widget (rule-based, captures emails as leads)

**Admin panel** (`/admin`)
- Dashboard with counts
- Home / CMS editor (hero, stats, services, CTA)
- Blog posts CRUD
- Events CRUD
- Team CRUD
- Leads inbox (status workflow, from contact form + chatbot)
- Chatbot config (welcome, fallback, keyword rules) + conversation log
- Site settings (branding, contact, socials)

## Prerequisites

- Node 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a connection string

## Setup

### 1. Server

```bash
cd server
cp .env.example .env       # edit JWT_SECRET, MONGODB_URI, admin creds
npm install
npm run seed               # creates admin user + sample content
npm run dev                # API on http://localhost:5050
```

Default admin login (change in `.env` before seeding):
`admin@noxtm.studio` / `admin12345`

### 2. Client

```bash
cd client
npm install
npm run dev                # site on http://localhost:5173
```

Vite proxies `/api` to the server on port 5050.

## Usage

- Public site: http://localhost:5173
- Admin panel: http://localhost:5173/admin (login link also in the footer)

## API overview

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/auth/login` | — | Admin login |
| GET | `/api/pages/:slug` | — | Page sections (home) |
| PUT | `/api/pages/:slug` | ✓ | Upsert page content |
| GET/POST/PUT/DELETE | `/api/posts` | read public / write ✓ | Blog |
| GET/POST/PUT/DELETE | `/api/events` | read public / write ✓ | Events |
| GET/POST/PUT/DELETE | `/api/team` | read public / write ✓ | Team |
| POST | `/api/leads` | — | Submit lead |
| GET/PUT/DELETE | `/api/leads` | ✓ | Manage leads |
| GET | `/api/chat/config` | — | Widget config |
| POST | `/api/chat/message` | — | Send chat message |
| GET/PUT | `/api/chat/admin/config` | ✓ | Chatbot rules |
| GET | `/api/chat/admin/conversations` | ✓ | Chat logs |
| GET/PUT | `/api/settings` | read public / write ✓ | Site settings |

## Notes

- Images are referenced by URL (no upload handling) to keep the stack light.
- The chatbot is rule-based: keyword match → answer, else fallback. Any email a
  visitor types is captured as a lead.
- Content is original; the reference site was used only for layout structure.
