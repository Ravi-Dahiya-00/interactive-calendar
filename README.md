# 📅 Interactive Calendar Application

A highly responsive, feature-rich interactive calendar application engineered with **Next.js 14**, **React 18**, and **TypeScript**. This project demonstrates an advanced understanding of modern web development, intricate component state management, and elegant UI/UX design.

It features a fully functional event management system complete with multi-faceted filtering, a beautifully crafted calendar grid, and robust client-side storage solutions, built strictly focusing on best practices and performance optimizations.

---

## ✨ Key Features

- **Interactive Wall-Calendar Grid:** A dynamic, perfectly scalable calendar supporting seamless day-range selections.
- **Advanced Notes & Event Management:** Add, edit, and organize notes/events. Includes features for categorizing by type and setting **Priority Levels** (Low, Medium, High).
- **Robust Search & Filtering Engine:**
  - Real-time inline search bar with text-match highlighting.
  - Complex filtering via sleek, absolute-positioned glassmorphic dropdowns (Filter by Date Range, Category, and Priority).
  - Built-in validation ensuring logical date range integrity (Start Date chronologically precedes End Date).
- **Local Storage Persistence:** A seamless user experience where all notes, calendar states, and configurations are saved locally across browser sessions.
- **Premium UI/UX Design:** A highly polished "wow-factor" visual aesthetic featuring sleek modern typography, soft glassmorphism effects, well-curated color-coded hover states, and smooth micro-animations.
- **Mobile-First Responsiveness:** Flawless transition from mobile devices up to large unscaled desktop displays.

---

## 🛠 Technology Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (Leveraging the App Router)
- **Library:** [React 18](https://react.dev/)
- **Language:** TypeScript (Strict typing for interface reliability)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) & Vanilla CSS for specific UI overrides and dynamic dynamic animations.
- **State Management & Logic:** Complex Custom React Hooks (`useCalendar`, `useEventFilters`, `useNotes`, `useReminders`) ensuring high decoupling and clean architecture.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/en/) installed (version 18 or above is recommended).

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Ravi-Dahiya-00/interactive-calendar.git
   cd interactive-calendar
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install / pnpm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

4. **Experience the app:**
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🏗️ Architecture & Engineering Best Practices

This project was built to illustrate production-quality engineering standards:

- **Modularity:** The UI is systematically broken down into distinct, reusable chunks (`Calendar`, `Notes`, `Theme`). 
- **Separation of Concerns:** Business logic is entirely extracted away from UI rendering. We utilize custom React hooks (e.g., `src/hooks/useEventFilters.ts`) to manage complex, interrelated states and filters.
- **Performance Optimizations:** Intentional use of React's `useMemo` and `useCallback` to prevent unnecessary component re-renders—especially critical within the complex grid rendering cycle.
- **Type Safety:** Extensive TS typing and interfaces drastically reduce runtime errors and enhance codebase maintainability.
- **Resilient Logic:** Deeply nested UI components are shielded gracefully via strict boundary and prop validation (e.g., preventing invalid date ranges natively in the filter pipeline).

---

## 💬 Contact & Links

Feel free to explore the codebase and reach out for any questions, feedback, or collaborations! 

*Designed and engineered with passion.*
