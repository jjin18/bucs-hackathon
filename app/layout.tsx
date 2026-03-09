import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jiahui Jin",
  description:
    "AI PM who launched products to 1M+ patients at NimbleRx (YC W15). Cal Hacks Grand Prize. MLH Top 50. Health AI trust researcher.",
  openGraph: {
    title: "Jiahui Jin",
    description: "Ask about my background, projects, and how I think.",
    url: "https://jiahui.xyz",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
