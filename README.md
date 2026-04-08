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

`> STATUS: DEPLOYED` &nbsp; `> BUILD: PASSING` &nbsp; `> VERSION: 1.0.0`

**[ [🔗 LIVE_DEMO](https://interactive-calendar-kappa.vercel.app/) ]** &nbsp;·&nbsp; **[ [💻 SOURCE](https://github.com/Ravi-Dahiya-00/interactive-calendar) ]**

</div>

---

## `> whoami`

A highly responsive, feature-rich interactive calendar application engineered with **Next.js 14**, **React 18**, and **TypeScript**. This project demonstrates an advanced understanding of modern web development, intricate component state management, and elegant UI/UX design.

It features a fully functional event management system complete with multi-faceted filtering, a beautifully crafted calendar grid, and robust client-side storage solutions — built strictly focusing on best practices and performance optimizations.

---

## `> cat features.log`

```
[✓] Interactive Wall-Calendar Grid ............ Dynamic, scalable calendar with seamless day-range selections
[✓] Notes & Event Management .................. Full CRUD with category classification & priority levels (Low/Med/High)
[✓] Search & Filtering Engine ................. Real-time inline search with text-match highlighting
[✓]   ├── Date Range Filter ................... Glassmorphic dropdown with start/end date validation
[✓]   ├── Category Filter ..................... Filter events by custom categories
[✓]   └── Priority Filter ..................... Filter by Low, Medium, High priority
[✓] Local Storage Persistence ................. All notes, calendar states & configs survive browser sessions
[✓] Premium UI/UX ............................ Glassmorphism, micro-animations, color-coded hover states
[✓] Mobile-First Responsive Design ........... Flawless scaling from mobile to ultra-wide displays
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
secondary = Vanilla CSS (custom animations & overrides)

[state]
pattern = Custom React Hooks
modules = useCalendar, useEventFilters, useNotes, useReminders, useDateRange, useNotifications
```

---

## `> tree src/`

```
src/
├── app/                      # Next.js 14 App Router
│   ├── globals.css           # Global styles & Tailwind imports
│   ├── layout.tsx            # Root layout with Theme Providers
│   └── page.tsx              # Main application entry point
│
├── components/               # Modular UI Components
│   ├── Calendar/             # Calendar grid, day cells, event indicators
│   │   └── CalendarGrid.tsx
│   ├── Notes/                # Note management UI
│   │   ├── FilterDatePicker.tsx
│   │   └── SearchMatchHighlight.tsx
│   └── Theme/                # Theme toggles & context providers
│
├── hooks/                    # ⚡ Core Business Logic
│   ├── useCalendar.ts        # Grid generation & navigation
│   ├── useDateRange.ts       # Range selection state machine
│   ├── useEventFilters.ts    # Search + advanced multi-filter pipeline
│   ├── useNotes.ts           # CRUD operations + localStorage sync
│   ├── useNotifications.ts   # Toast notification system
│   └── useReminders.ts       # Reminder scheduling & state
│
└── types/                    # TypeScript Definitions
    └── index.ts              # Shared application interfaces
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

# Navigate to the project
$ cd interactive-calendar

# Install dependencies
$ npm install

# Fire up the dev server
$ npm run dev

# Application is now live at:
# → http://localhost:3000
```

---

## `> cat architecture.md`

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE OVERVIEW                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────┐    ┌──────────────┐    ┌───────────────────┐     │
│   │  PAGE    │───▶│  COMPONENTS  │───▶│   CUSTOM HOOKS    │     │
│   │ (entry)  │    │  (Calendar,  │    │  (useCalendar,    │     │
│   │          │    │   Notes,     │    │   useNotes,       │     │
│   │          │    │   Theme)     │    │   useFilters...)   │     │
│   └─────────┘    └──────────────┘    └───────┬───────────┘     │
│                                               │                 │
│                                      ┌────────▼────────┐       │
│                                      │   TYPES / API   │       │
│                                      │  (index.ts)     │       │
│                                      └────────┬────────┘       │
│                                               │                 │
│                                      ┌────────▼────────┐       │
│                                      │  LOCAL STORAGE  │       │
│                                      │  (persistence)  │       │
│                                      └─────────────────┘       │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  PRINCIPLES:                                                    │
│  [✓] Separation of Concerns — Logic decoupled from UI          │
│  [✓] Type Safety — Strict TS interfaces across all layers      │
│  [✓] Performance — useMemo/useCallback to prevent re-renders   │
│  [✓] Modularity — Reusable, composable component design        │
│  [✓] Resilient Logic — Boundary validation in filter pipeline  │
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
