import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Preppy — Prep for the Digital PSAT & AP exams",
    template: "%s · Preppy",
  },
  description:
    "Preppy helps students master the Digital PSAT and AP exams with focused lessons, realistic timed mock tests, instant feedback, and momentum that keeps you coming back.",
  icons: {
    icon: "/favicon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#16264D",
  width: "device-width",
  initialScale: 1,
};

// Applied before paint to prevent a light/dark flash on first load.
const themeScript = `
(function () {
  try {
    var t = localStorage.getItem('preppy-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={sans.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
