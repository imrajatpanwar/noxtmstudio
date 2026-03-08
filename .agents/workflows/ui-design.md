---
description: Noxtm Studio UI Design System & Style Guide
---

# 🕉️ VIRĀT DIGITAL — Premium Indian Cultural UI Design Skill
## *Digital Marketing Agency Website — Complete Design System*
### Agency: **VIRĀT DIGITAL** (विराट डिजिटल) — "Grand • Immense • Supreme"
### Services: Social Media Management · Meta Ads · Graphic Design

---

## 📋 TABLE OF CONTENTS

1. [Design Philosophy](#1-design-philosophy)
2. [Color System](#2-color-system)
3. [Typography System](#3-typography-system)
4. [Iconography & Cultural Motifs](#4-iconography--cultural-motifs)
5. [Layout & Grid System](#5-layout--grid-system)
6. [Component Library](#6-component-library)
7. [Animation & Motion System](#7-animation--motion-system)
8. [Page-by-Page Breakdown](#8-page-by-page-breakdown)
9. [Responsive Design Strategy](#9-responsive-design-strategy)
10. [Performance & SEO](#10-performance--seo)
11. [Tech Stack & File Structure](#11-tech-stack--file-structure)

---

## 1. DESIGN PHILOSOPHY

> **Core Inspiration**: Sarvam.ai — blending Indian cultural heritage with modern premium tech aesthetics.

### Design DNA

| Principle | Description |
|-----------|-------------|
| **Indian Heritage First** | Sanskrit naming, mandala motifs, Jharokha-inspired frames, rangoli patterns |
| **Premium Minimalism** | Abundant whitespace, soft surfaces, large border-radii (32px+) |
| **Warm & Organic** | Warm off-white backgrounds — never cold/harsh whites |
| **Serif Elegance** | Serif headings for cultural gravitas, sans-serif body for readability |
| **Soft Depth** | No harsh shadows — use subtle elevation, soft glows, gradients |

### Brand Tagline Options
- "विराट विज़न, डिजिटल मिशन" — Grand Vision, Digital Mission
- "From Heritage to Hashtags"
- "भारत की डिजिटल शक्ति" — India's Digital Power

---

## 2. COLOR SYSTEM

### Primary Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg-primary` | `#FAF8F5` | Main page background (warm off-white) |
| `--bg-secondary` | `#F3EFE8` | Section alternate backgrounds |
| `--surface` | `#F0ECE4` | Cards, elevated panels |
| `--surface-hover` | `#E8E3DA` | Hover state on surfaces |
| `--border` | `rgba(0,0,0,0.06)` | Subtle card/section borders |

### Text Colors

| Token | Hex | Usage |
|-------|-----|-------|
| `--text-primary` | `#131313` | Headings, primary content |
| `--text-body` | `#3D3D3D` | Body text |
| `--text-muted` | `#7A7A7A` | Descriptions, captions |
| `--text-subtle` | `#A0A0A0` | Labels, meta text |

### Accent Colors (Sarvam-inspired)

| Token | Hex | Usage |
|-------|-----|-------|
| `--saffron` | `#E8722A` | Announcements, cultural highlights |
| `--saffron-light` | `#F5A623` | Gradient pair with saffron |
| `--amber` | `#F0A030` | Warm accent, CTAs |
| `--deep-orange` | `#D4621A` | Hover states |
| `--sacred-blue` | `#6366F1` | Links, interactive elements |
| `--lavender` | `#C4B5FD` | Hero gradients, subtle accents |
| `--jharokha-lavender` | `#dfd8fe` | Jharokha frame outer shape fill |
| `--emerald` | `#10B981` | Success states, icon accents |

### Cultural Gradients

```css
/* Saffron Sunrise — for illustration cards */
--gradient-saffron: linear-gradient(180deg, #F5A623 0%, #E8722A 50%, #A78BFA 100%);

/* Sacred Lavender — for hero backgrounds */
--gradient-hero: linear-gradient(180deg, #FAF8F5 0%, #EDE9FE 40%, #C4B5FD 100%);

/* Temple Gold — for premium highlights */
--gradient-gold: linear-gradient(135deg, #F5D78E 0%, #D4A15A 100%);

/* Announcement Bar */
--gradient-announce: linear-gradient(90deg, #F5A623, #E8722A, #F5A623);
```

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack

| Role | Font | Fallback | Weight |
|------|------|----------|--------|
| **Headings** | `Playfair Display` | `Georgia, serif` | 500, 700 |
| **Body / UI** | `Inter` | `system-ui, sans-serif` | 400, 500, 600, 700 |
| **Hindi/Sanskrit** | `Noto Sans Devanagari` | `sans-serif` | 400, 600 |
| **Monospace** | `JetBrains Mono` | `monospace` | 400 |

> **Why Playfair Display?**: It mimics Sarvam's elegant serif ("Season Mix") — literary, cultural, premium. Freely available on Google Fonts.

### Type Scale

| Element | Size | Weight | Letter-Spacing | Font |
|---------|------|--------|----------------|------|
| Hero H1 | `clamp(3rem, 6vw, 5rem)` | 700 | `-0.03em` | Playfair Display |
| Section H2 | `clamp(2rem, 4vw, 3rem)` | 700 | `-0.02em` | Playfair Display |
| Card H3 | `1.25rem` | 700 | `-0.01em` | Inter |
| Body | `1rem` (16px) | 400 | `0` | Inter |
| Small / Caption | `0.875rem` (14px) | 500 | `0.02em` | Inter |
| Nav Links | `0.8rem` | 600 | `0.08em` | Inter (uppercase) |
| Hindi Text | `1.1rem` | 400 | `0.01em` | Noto Sans Devanagari |

### Google Fonts Import

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@500;700&family=Noto+Sans+Devanagari:wght@400;600&display=swap');
```

---

## 4. ICONOGRAPHY & CULTURAL MOTIFS

### Mandatory Cultural Elements

1. **Mandala Motif** — SVG mandala/floral pattern above the hero heading (like Sarvam's ornamental swirl)
2. **Jharokha Frames** — Arched window-style frames around service illustrations
3. **Rangoli Dividers** — Decorative section dividers using rangoli-inspired SVG patterns
4. **Paisley Accents** — Subtle paisley patterns as background textures at 3-5% opacity
5. **Lotus Icons** — Use lotus-inspired shapes for bullet points and list markers
6. **Om/Devanagari Flourishes** — Small Sanskrit text used as decorative labels (e.g., "सेवा" for Services)

### SVG Ornament Examples

```html
<!-- Hero Mandala Ornament (simplified) -->
<svg class="cultural-ornament" viewBox="0 0 200 60" fill="none">
  <path d="M60 30 C60 10, 100 0, 100 30 C100 0, 140 10, 140 30" 
        stroke="currentColor" stroke-width="1.5" opacity="0.3"/>
  <circle cx="100" cy="30" r="15" stroke="currentColor" 
          stroke-width="1.5" opacity="0.3"/>
  <!-- Petal shapes radiating from center -->
  <path d="M100 15 Q110 25 100 35 Q90 25 100 15" 
        stroke="currentColor" stroke-width="1" opacity="0.2"/>
</svg>
```

### Jharokha Frame Design (Hero Decorative Element)

The Jharokha frame is a **4-pointed scalloped Islamic/Indian arch frame** used as the hero visual element. It consists of exactly **2 layered shapes**:

| Layer | Fill | Effect | Description |
|-------|------|--------|-------------|
| **Outer shape** | `#dfd8fe` (soft lavender) | Inner shadow (`stdDeviation: 22.39`, color: `rgba(0, 117, 193, 0.98)`) | 4-pointed scalloped silhouette with curved concave edges between cusps |
| **Inner shape** | `#FFFFFF` (white) | Drop shadow (white glow) + Inner shadow (same blue-tint as outer) | Smaller concentric version of the outer shape, creates the "window" effect |

**Key design rules:**
- Exactly **4 cardinal-point cusps** (top, right, bottom, left) with scalloped curves between them
- **Only 2 shapes** — no duplicates, no extra layers
- Inner shadow color matrix: `R:0 G:0.46 B:0.76 A:0.98` (produces the blue depth glow)
- SVG viewBox: `0 0 378 378`
- CSS size: `480px` width (desktop), scales down responsively
- Drop shadow: `drop-shadow(0 12px 48px rgba(223, 216, 254, 0.35))`
- Reference file: `designsvg.svg`

```css
.jharokha-frame {
  width: 480px;
  height: auto;
  filter: drop-shadow(0 12px 48px rgba(223, 216, 254, 0.35));
}
```

### Icon Style
- Use **outlined/line** icons (not filled) — matches Sarvam's clean aesthetic
- Icon stroke width: `1.5px`
- Colors: `var(--text-muted)` default, `var(--saffron)` on hover/active
- Recommended library: **Lucide Icons** or custom SVGs

---

## 5. LAYOUT & GRID SYSTEM

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

@media (min-width: 1280px) {
  .container { max-width: 1200px; }
}
@media (min-width: 1536px) {
  .container { max-width: 1400px; }
}
```

### Grid System

```css
/* 2-column feature layout (Sarvam-style: image left, text right) */
.feature-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

/* 3-column card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .feature-row { grid-template-columns: 1fr; gap: 2rem; }
  .card-grid { grid-template-columns: 1fr; }
}
```

### Spacing Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `0.5rem` (8px) | Tight gaps |
| `--space-sm` | `1rem` (16px) | Component padding |
| `--space-md` | `1.5rem` (24px) | Card padding |
| `--space-lg` | `3rem` (48px) | Section gaps |
| `--space-xl` | `5rem` (80px) | Section padding vertical |
| `--space-2xl` | `8rem` (128px) | Hero section padding |

### Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `12px` | Small buttons, tags |
| `--radius-md` | `20px` | Cards |
| `--radius-lg` | `32px` | Large cards, illustration panels |
| `--radius-xl` | `40px` | Hero panels, section containers |
| `--radius-full` | `999px` | Pills, nav buttons, badges |

> **Key**: Sarvam uses very large radii (32–40px) on cards/illustration panels. This gives the soft, premium feel.

---

## 6. COMPONENT LIBRARY

### 6.1 Navbar (Sarvam-style)

```
┌──────────────────────────────────────────────────────────────┐
│  ◉ VIRĀT   PLATFORM >  DEVELOPERS >  BLOGS >  COMPANY >    │
│                                    [Experience ●] [Talk to Sales] │
└──────────────────────────────────────────────────────────────┘
```

**Specifications:**
- **Position**: Fixed top, full-width
- **Background**: `var(--bg-primary)` with `backdrop-filter: blur(12px)`
- **Border-bottom**: `1px solid var(--border)`
- **Logo**: "VIRĀT" in Playfair Display, bold, with small cultural icon
- **Nav Links**: UPPERCASE, `letter-spacing: 0.08em`, `font-size: 0.8rem`, `font-weight: 600`
- **Primary CTA**: Dark pill button (`#131313`) with **inner white glow** (`box-shadow: inset 0 0 12px rgba(255,255,255,0.3)`)
- **Secondary CTA**: Ghost pill with subtle border
- **Height**: ~64px
- **Padding**: `0 40px`

### 6.2 Announcement Bar (above navbar)

```css
.announcement-bar {
  background: var(--gradient-announce);
  padding: 10px 0;
  text-align: center;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
  /* Decorative triangular pattern at bottom edge */
}
```

### 6.3 Buttons

#### Primary Button (Dark with inner glow — Sarvam signature)
```css
.btn-primary {
  background: #131313;
  color: #fff;
  padding: 12px 28px;
  border-radius: var(--radius-full);
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  cursor: pointer;
  box-shadow: inset 0 0 12px rgba(255, 255, 255, 0.15);
  transition: all 0.3s ease;
}
.btn-primary:hover {
  box-shadow: inset 0 0 16px rgba(255, 255, 255, 0.25),
              0 8px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
```

#### Ghost Button
```css
.btn-ghost {
  background: transparent;
  color: var(--text-primary);
  padding: 12px 28px;
  border-radius: var(--radius-full);
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}
.btn-ghost:hover {
  border-color: var(--text-primary);
  background: rgba(0, 0, 0, 0.03);
}
```

#### Pill Tag / Badge
```css
.badge {
  display: inline-block;
  padding: 8px 20px;
  border-radius: var(--radius-full);
  border: 1px solid var(--border);
  background: rgba(0, 0, 0, 0.02);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-body);
}
```

### 6.4 Service Cards (Sarvam Feature-row style)

**Layout**: 2 columns — large illustration panel (left) + text + pill tags (right)

```css
.service-card {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  padding: var(--space-xl) 0;
}

.service-illustration {
  border-radius: var(--radius-lg); /* 32px */
  overflow: hidden;
  background: var(--gradient-saffron);
  aspect-ratio: 4/5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-text h3 {
  font-family: 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--text-primary);
}

.service-text p {
  font-size: 1rem;
  color: var(--text-muted);
  line-height: 1.7;
  margin-bottom: 1.5rem;
}
```

### 6.5 Blog/Updates Cards (3-column grid)

```css
.update-card {
  background: var(--surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid var(--border);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.update-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
}

.update-card-body {
  padding: 1.5rem;
}

.update-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin-bottom: 0.5rem;
}

.update-card-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.update-card-date {
  color: var(--text-muted);
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.update-card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--gradient-saffron);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
```

### 6.6 Testimonial Card

```css
.testimonial {
  background: var(--surface);
  border-radius: var(--radius-lg);
  padding: 3rem;
  border: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.testimonial-quote {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-style: italic;
  line-height: 1.8;
  color: var(--text-body);
  max-width: 65%;
}

.testimonial-author {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}
```

### 6.7 Footer (4-column Sarvam style)

```
┌───────────────────────────────────────────────────────────────┐
│  Build the future of your brand with VIRĀT                     │
│                                                                 │
│  Services       Company       Resources      Socials           │
│  SMM             About         Blog           LinkedIn          │
│  Meta Ads        Careers       Case Studies   Twitter           │
│  Graphic Design  Contact       Resources      Instagram         │
│                                                                 │
│  ─── ◉ VIRĀT DIGITAL ─── © 2026 ─────────────────────────────  │
└───────────────────────────────────────────────────────────────┘
```

---

## 7. ANIMATION & MOTION SYSTEM

### Transition Defaults
```css
--ease-default: cubic-bezier(0.4, 0, 0.2, 1);
--duration-fast: 0.2s;
--duration-normal: 0.3s;
--duration-slow: 0.6s;
```

### Entrance Animations

```css
/* Fade up — for hero content */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Fade in — for general elements */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Scale in — for cards on scroll */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

/* Slide from left — for service illustrations */
@keyframes slideLeft {
  from { opacity: 0; transform: translateX(-40px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Slide from right — for service text */
@keyframes slideRight {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}
```

### Scroll-triggered Animation (CSS + Intersection Observer)

```javascript
// Apply 'animate-in' class when element enters viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
```

### Hover Micro-interactions
- **Cards**: `translateY(-4px)` + soft shadow expansion
- **Buttons**: `translateY(-2px)` + glow intensification
- **Links**: Color transition to `var(--saffron)` with underline slide-in
- **Icons**: Subtle rotate or scale (`1.05`) on hover
- **Cultural motifs**: Very slow continuous rotation (`60s linear infinite`)

---

## 8. PAGE-BY-PAGE BREAKDOWN

### 8.1 HOME PAGE

#### Section Order:
1. **Announcement Bar** — Saffron gradient strip with latest news
2. **Navbar** — Fixed, with cultural logo + dark CTA
3. **Hero Section**
   - Cultural floral/mandala SVG ornament centered above heading
   - Pill badge: "भारत की #1 डिजिटल मार्केटिंग एजेंसी"
   - H1 (Serif): "Grand Vision,\nDigital Mission"
   - Subtitle (Sans): "Social Media · Meta Ads · Graphic Design — crafted with Indian cultural precision"
   - CTA buttons: [Get Started ●] [Our Work →]
   - Background: `var(--gradient-hero)` — soft lavender fade
4. **Trust Bar** — Client logos strip: "India's brands trust VIRĀT"
5. **Services Section** (3 feature rows, alternating layout)
   - Row 1: [Illustration Left] Social Media Management → [Text Right]
   - Row 2: [Text Left] ← Meta Ads [Illustration Right]
   - Row 3: [Illustration Left] Graphic Design → [Text Right]
   - Each illustration panel: `var(--gradient-saffron)` background, 32px radius, cultural SVG inside
6. **Results/Stats Section** — Large serif numbers with small labels
7. **Testimonials** — Single testimonial card with avatar + quote + "Read case study" ghost button
8. **Blog/Updates** — 3-column card grid
9. **CTA Section** — Large serif heading + dark CTA button
10. **Footer** — 4-column layout

#### Hero Section CSS Skeleton:
```css
.hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-2xl) var(--space-md);
  background: var(--gradient-hero);
  position: relative;
  overflow: hidden;
}

.hero-ornament {
  width: 200px;
  height: auto;
  margin-bottom: 2rem;
  opacity: 0.4;
  color: var(--text-muted);
}

.hero h1 {
  font-family: 'Playfair Display', serif;
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.15rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 600px;
  margin: 0 auto 2.5rem;
}
```

### 8.2 SERVICES PAGE
- Individual deep-dive for each service
- Each service: Hero with Jharokha-framed illustration, feature list, pricing cards, CTA

### 8.3 ABOUT PAGE
- Team section, mission (with cultural Sanskrit quotes), timeline

### 8.4 CONTACT PAGE
- Clean form on warm background, office location, social links

---

## 9. RESPONSIVE DESIGN STRATEGY

### Breakpoints (Mobile-First)

```css
--bp-sm:    640px;    /* Large phones */
--bp-md:    768px;    /* Tablets */
--bp-lg:    1024px;   /* Small laptops */
--bp-xl:    1280px;   /* Desktops */
--bp-2xl:   1536px;   /* Large screens */
```

### Key Responsive Rules

| Element | Mobile | Tablet | Desktop |
|---------|--------|--------|---------|
| Navbar | Hamburger menu | Full links | Full links + CTAs |
| Hero H1 | `3rem` | `3.5rem` | `5rem` |
| Service rows | Stack (1 col) | Stack (1 col) | 2 columns |
| Card grid | 1 column | 2 columns | 3 columns |
| Section padding | `3rem 1.5rem` | `4rem 2rem` | `6rem 3rem` |
| Footer | Stacked | 2×2 grid | 4 columns |

---

## 10. PERFORMANCE & SEO

### SEO Requirements
- Unique `<title>` per page: `"VIRĀT Digital — [Page] | Premium Indian Digital Marketing"`
- Meta descriptions mentioning services and Indian cultural branding
- Single `<h1>` per page, proper `<h2>`/`<h3>` hierarchy
- Semantic HTML5 elements: `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`
- All images: `alt` text, lazy loading, WebP format
- Schema.org LocalBusiness markup

### Performance
- Font preloading for Playfair Display and Inter
- Image optimization: SVGs for motifs, WebP for photos
- CSS: No unused styles, critical CSS inlined
- Intersection Observer for scroll animations (no heavy JS libraries)
- Lighthouse target: 90+ on all metrics

---

## 11. TECH STACK & FILE STRUCTURE

### Stack
- **Framework**: React (Create React App)
- **Styling**: Vanilla CSS with CSS custom properties
- **Fonts**: Google Fonts (Playfair Display, Inter, Noto Sans Devanagari)
- **Icons**: Lucide React or custom SVGs
- **Animations**: CSS keyframes + Intersection Observer API
- **No external UI libraries** — all custom components

### File Structure

```
src/
├── App.js                    — Root component, routing
├── App.css                   — Global resets, CSS variables, base styles
├── assets/
│   ├── motifs/               — SVG cultural motifs (mandala, paisley, rangoli)
│   ├── illustrations/        — Service illustration SVGs
│   └── images/               — Photos, client logos
├── components/
│   ├── Navbar.js             — Fixed navbar with cultural logo
│   ├── Navbar.css
│   ├── AnnouncementBar.js    — Saffron gradient top bar
│   ├── Footer.js             — 4-column footer
│   ├── Footer.css
│   ├── ServiceCard.js        — 2-col feature row component
│   ├── ServiceCard.css
│   ├── TestimonialCard.js    — Client quote card
│   ├── BlogCard.js           — Update/blog card
│   ├── Button.js             — Primary, Ghost, Badge variants
│   └── CulturalOrnament.js   — SVG ornament component
├── pages/
│   ├── Home.js               — Landing page
│   ├── Home.css
│   ├── Services.js           — Services deep-dive
│   ├── About.js              — About page
│   └── Contact.js            — Contact form page
└── utils/
    └── scrollObserver.js     — Intersection Observer utility
```

---

## ✅ DESIGN CHECKLIST

Before shipping any page, verify:

- [ ] Playfair Display used for ALL section headings
- [ ] Inter used for ALL body/UI text
- [ ] Warm off-white background (`#FAF8F5`), never pure white
- [ ] At least one cultural SVG motif per major section
- [ ] Card border-radius is 20px+ (illustration panels 32px+)
- [ ] Primary buttons have inner white glow shadow
- [ ] Nav links are UPPERCASE with wide letter-spacing
- [ ] Scroll animations trigger via Intersection Observer
- [ ] Mobile-first responsive design verified at all breakpoints
- [ ] Hindi/Sanskrit decorative text uses Noto Sans Devanagari
- [ ] Saffron/amber gradient used for illustration backgrounds
- [ ] Generous whitespace between sections (80px+ on desktop)
- [ ] No harsh shadows — only soft, diffused ones
- [ ] All interactive elements have smooth transitions (0.3s)
