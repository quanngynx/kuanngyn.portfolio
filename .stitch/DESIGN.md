---
name: Kinetic Engineering v2
colors:
  background: '#0c0d12'
  surface: '#15161a'
  surface-dim: '#15161a'
  surface-bright: '#2a2d36'
  surface-container-lowest: '#0b0c10'
  surface-container-low: '#0f1015'
  surface-container: '#15161a'
  surface-container-high: '#20222b'
  surface-container-highest: '#2e313d'
  on-surface: '#f5f6f9'
  on-surface-variant: '#aaaeb9'
  outline: '#3f424d'
  outline-variant: '#2a2d36'
  primary: '#00d2ff'
  on-primary: '#051424'
  primary-container: '#006875'
  on-primary-container: '#c3f5ff'
  secondary: '#b6d2ff'
  on-secondary: '#002d69'
  secondary-container: '#1d4480'
  on-secondary-container: '#d8e2ff'
  tertiary: '#cdffe8'
  on-tertiary: '#003828'
  tertiary-container: '#00523c'
  on-tertiary-container: '#e4fff2'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
typography:
  display-lg:
    fontFamily: Geist Sans
    fontSize: 56px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.04em
  headline-md:
    fontFamily: Geist Sans
    fontSize: 36px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.4'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
rounded:
  sm: 4px
  DEFAULT: 8px
  md: 12px
  lg: 16px
  xl: 24px
  full: 9999px
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  max-width: 1200px
---

## Codebase Purpose & Goals

The portfolio is built as a high-performance, responsive React application using **Next.js 16** (utilizing the App Router with internationalization `next-intl`) and styled with **Tailwind CSS v4**.

The primary goal of this website is to position **Nguyen Minh Quan (John Nguyen)** not as a generic designer/artist, but as a premium **AI Product Engineer** and **Full-stack Developer**. 

### Key Portions of the Codebase:
- **Root Layout:** `src/app/[locale]/layout.tsx` (configures localizations, metadata, and viewport properties).
- **Home Page:** `src/app/[locale]/page.tsx` (renders the main landing layout with interactive sidebar navigation and the projects carousel).
- **Career Page:** `src/app/[locale]/career/page.tsx` (hosts the professional timeline, certifications, achievements, and technology stacks).
- **Contact Page:** `src/app/[locale]/contact/page.tsx` (a conversion-oriented layout featuring a form integrated with Server Actions to trigger Discord webhook alerts).

---

## Visual Design & Aesthetics

The visual language transitions the site from an "art portfolio" to a **Sleek, Developer-Centric Console**—matching the aesthetic standards of Linear, Stripe, and modern AI startups like Supabase and Raycast.

- **Primary Style:** Clean, high-contrast Dark Mode with a dark space background (`#0c0d12`) and translucent layers.
- **Visual Metaphor:** The **"Luminescent Command Center"**—using neon outline glows, tabular data grids, glass panels, and interactive indicators.
- **Key Accent:** Electric Cyan (`#00d2ff`) for interactive actions, timeline progress, and highlights.
- **Secondary Accent:** Tech Indigo (`#1d4480`) for structure, and Mint Green (`#cdffe8`) for active/success badges.

---

## Typography Guidelines

We use a clean, geometric font pairing to maintain a sharp, code-adjacent feel:
- **Geist Sans** (Branding, Category Headers, Hero Title): Promotes a modern, structured visual identity.
- **Inter** (Body Copy, Form Fields, Descriptions): Delivers high legibility in dense lists and grids.
- **JetBrains Mono** (Metadata tags, date chips, tech stack indicators): Reinforces the engineering context.

### Formatting Rules:
- Loading states must end with a typographic ellipse (`…`) rather than three periods (`...`).
- Number columns and metrics tables must use `font-variant-numeric: tabular-nums` for precise alignment.

---

## Layout & Components

### Sidebar Navigation
- Anchored to the left with a vertical glass overlay (`#2a2d36` with 20% opacity and `backdrop-filter: blur(12px)`).
- Contains clean, stroke-based custom icons (Home, MousePointer, Camera, Globe, Mail, Github, Linkedin).

### Project Cards
- Elevated cards utilizing a dark semi-transparent surface (`#15161a`).
- Rounded corners at `16px` (`rounded-lg`) with a subtle 1px border (`#2a2d36`).
- Hover effects trigger a scale transition, neon drop-shadows, and border glow transitions to the card's specific gradient.

### Interactive Components
- **Buttons:** Primary buttons use solid Cyan with dark text; secondary actions use ghost styling with border transitions.
- **Recruiter Shortcuts:** Key focus areas (Resume Download, SHOPWISE Demo, READDI Demo) receive premium glows and prominent placements.
