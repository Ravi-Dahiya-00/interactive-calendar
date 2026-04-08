```
 ██╗███╗   ██╗████████╗███████╗██████╗  █████╗  ██████╗████████╗██╗██╗   ██╗███████╗
 ██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔════╝╚══██╔══╝██║██║   ██║██╔════╝
 ██║██╔██╗ ██║   ██║   █████╗  ██████╔╝███████║██║        ██║   ██║██║   ██║█████╗  
 ██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══██║██║        ██║   ██║╚██╗ ██╔╝██╔══╝  
 ██║██║ ╚████║   ██║   ███████╗██║  ██║██║  ██║╚██████╗   ██║   ██║ ╚████╔╝ ███████╗
 ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝   ╚═╝   ╚═╝  ╚═══╝  ╚══════╝
  ██████╗ █████╗ ██╗     ███████╗███╗   ██╗██████╗  █████╗ ██████╗                    
 ██╔════╝██╔══██╗██║     ██╔════╝████╗  ██║██╔══██╗██╔══██╗██╔══██╗                   
 ██║     ███████║██║     █████╗  ██╔██╗ ██║██║  ██║███████║██████╔╝                   
 ██║     ██╔══██║██║     ██╔══╝  ██║╚██╗██║██║  ██║██╔══██║██╔══██╗                   
 ╚██████╗██║  ██║███████╗███████╗██║ ╚████║██████╔╝██║  ██║██║  ██║                   
  ╚═════╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═══╝╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝                   
```

<div align="center">

[![Live Demo](https://img.shields.io/badge/DEMO-Live_Preview-0070f3?style=for-the-badge&logo=vercel&logoColor=white)](https://interactive-calendar-kappa.vercel.app/)
&nbsp;
[![Source Code](https://img.shields.io/badge/SOURCE-GitHub_Repo-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Ravi-Dahiya-00/interactive-calendar)

<br/>

`> STATUS: PREMIUM_UPGRADE_COMPLETE` &nbsp; `> BUILD: OPTIMIZED` &nbsp; `> VERSION: 2.0.0`

</div>

---

## `> whoami`

A state-of-the-art, interactive calendar and productivity engine built with **Next.js 14**, **React 18**, and **advanced TypeScript**.

This project provides a professional-grade experience for managing time and notes. It features a "Quick-Capture" notes system (like Google Keep), an interactive analytics dashboard, and dynamic ambient environment effects that change throughout the year.

---

## `> cat features.log`

```
[✦] Interactive Analytics Dashboard .......... Clickable stat cards with progress bars & deep-dive modals
[✦] Google Keep Style Notes ................. Unified capture UI with titles, time, and reminders
[✦] Ambient Seasonal Effects ................ Dynamic month-based animations (Rain, Snow, Fireflies, Petals)
[✦] Drag-to-Select UX ....................... Premium range selection with real-time hover previews
[✦] Full Details Modal ...................... Glassmorphic view for managing long-form notes & events
[✦] Premium Typography ...................... Striking hierarchy using bold weights & smart opacities
[✓] Interactive Wall-Calendar Grid .......... Smooth day-range selections and navigation
[✓] Search & Filtering Engine ............... Real-time text-match highlighting and priority filters
[✓] Date Range Filter ....................... Glassmorphic date picker with automatic validation
[✓] Local Storage Persistence ............... All notes and settings survive browser refreshes
[✓] Mobile-First Responsive Design .......... Flawless scaling from mobile to ultra-wide screens
[✓]   └── Theme Engine ...................... Real-time accent color switching & ambient toggles
```

---

## `> cat tech_stack.conf`

```ini
[framework]
name    = Next.js
version = 14.2.15
router  = App Router

[library]
name    = React
version = 18.2.0

[language]
name    = TypeScript
mode    = strict

[styling]
primary   = Tailwind CSS 3.4
design    = Glassmorphism & Custom Animations

[state]
pattern = Custom React Hooks (12+ functional modules)
modules = useAnalytics, useSeasonalEffects, useCalendar, useEventFilters, useNotes, useDateRange
```

---

## `> tree src/`

```
src/
├── app/                      # Main Next.js App Router folders
│   ├── favicon.ico           # Application icon
│   ├── globals.css           # Global styles and Tailwind layers
│   ├── layout.tsx            # Root layout for page structure
│   └── page.tsx              # Main homepage entry point
│
├── components/               # Modular UI Components
│   ├── Analytics/            # Dashboard components
│   │   ├── AnalyticsModal.tsx
│   │   └── MiniAnalyticsDashboard.tsx
│   ├── Calendar/             # Calendar specific logic
│   │   ├── Calendar.tsx
│   │   ├── CalendarGrid.tsx
│   │   ├── CalendarHeader.tsx
│   │   ├── DailySummaryModal.tsx
│   │   └── DayCell.tsx
│   ├── Common/               # Reusable UI elements
│   │   └── EmptyState.tsx
│   ├── Notes/                # Note-taking UI
│   │   ├── FilterDatePicker.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── NoteDetailsModal.tsx
│   │   ├── NotesPanel.tsx
│   │   └── SearchMatchHighlight.tsx
│   └── Theme/                # Visual FX and Style settings
│       ├── SeasonalEffects.tsx
│       ├── ThemeCustomizer.tsx
│       └── ThemeToggle.tsx
│
├── contexts/                 # Global state providers
│   └── ThemeContext.tsx      # Theme and Seasonal state
│
├── hooks/                    # ⚡ Core Logic Hooks
│   ├── useAnalytics.ts       # Dashboard calculations
│   ├── useCalendar.ts        # Grid generation
│   ├── useDateRange.ts       # Drag selection
│   ├── useDateUtils.ts       # Formatting helpers
│   ├── useEventDragDrop.ts   # Mouse drag moves
│   ├── useEventFilters.ts    # Search logic
│   ├── useNotes.ts           # CRUD and Storage
│   ├── useNotifications.ts   # Toasts and alerts
│   ├── useReminders.ts       # Scheduled alerts
│   └── useSeasonalEffects.ts # Dynamic environment
│
├── types/                    # TypeScript interfaces
│   └── index.ts              # Data models (Note, CalendarDay, etc.)
│
└── utils/                    # Helper functions
    ├── dateUtils.ts          # Core math for dates
    └── holidays.ts           # Holiday list database
```

---

## `> ./install.sh`

### Prerequisites

```bash
$ node --version   # v18.0.0 or above required
$ npm --version    # v9.0.0 or above recommended
```

### Quick Start

```bash
# Clone the repository
$ git clone https://github.com/Ravi-Dahiya-00/interactive-calendar.git

# Navigate to project
$ cd interactive-calendar

# Install dependencies
$ npm install

# Run the project
$ npm run dev
```

---

## `> cat architecture.md`

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE OVERVIEW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐    ┌──────────────┐    ┌───────────────────┐      │
│   │  PAGE    │───▶│  COMPONENTS  │───▶│   CUSTOM HOOKS    │      │
│   │ (entry)  │    │ (Dash, Grid, │    │  (Analytics,      │      │
│   │          │    │  QuickNote)  │    │   Seasonal,       │      │
│   │          │    └──────────────┘    │   DateRange)      │      │
│   └─────────┘                         └───────┬───────────┘      │
│                                               │                  │
│                                      ┌────────▼────────┐        │
│                                      │   TYPES / UTILS │        │
│                                      │  Shared Models  │        │
│                                      └────────┬────────┘        │
│                                               │                  │
│                                      ┌────────▼────────┐        │
│                                      │  LOCAL STORAGE  │        │
│                                      │ (Persistence)   │        │
│                                      └─────────────────┘        │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PRINCIPLES:                                                    │
│  [✓] Separation of Concerns — Logic decoupled from UI           │
│  [✓] Type Safety — Strict TS interfaces for data integrity      │
│  [✓] Performance — useMemo/useCallback to prevent re-renders    │
│  [✓] Modularity — Reusable, composable component design         │
│  [✓] Aesthetics — Premium typography, shadows, and anims        │
└─────────────────────────────────────────────────────────────────┘
```

---

## `> cat contact.sh`

```bash
#!/bin/bash
# ┌──────────────────────────────────────────┐
# │          CONNECT WITH THE DEV            │
# └──────────────────────────────────────────┘

GITHUB="https://github.com/Ravi-Dahiya-00"
LINKEDIN="https://www.linkedin.com/in/raviyadav23/"

echo "📬 Reach out for questions, feedback, or collaborations!"
echo ""
echo "  ▸ GitHub   → $GITHUB"
echo "  ▸ LinkedIn → $LINKEDIN"
```

<div align="center">

**[ [<img src="https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white" alt="GitHub" />](https://github.com/Ravi-Dahiya-00) ]** &nbsp; **[ [<img src="https://img.shields.io/badge/LinkedIn-0A66C2?logo=linkedin&logoColor=white" alt="LinkedIn" />](https://www.linkedin.com/in/raviyadav23/) ]**

</div>

---

<div align="center">

```
 ╔══════════════════════════════════════════╗
 ║  Designed & Engineered with passion 🚀  ║
 ╚══════════════════════════════════════════╝
```

</div>
