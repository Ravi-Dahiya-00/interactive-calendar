// Entry point of the app. Just renders the main Calendar component on the page.
import { Calendar } from '@/components/Calendar/Calendar';

export default function Home() {
  return (
    <main className="min-h-screen flex items-start justify-center pt-4 sm:pt-8">
      <Calendar />
    </main>
  );
}
