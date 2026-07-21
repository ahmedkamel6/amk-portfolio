import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Syne, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeApplier } from "@/components/portfolio/ThemeApplier";
import { getAppearance } from "@/lib/portfolio/db";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ahmedmkamel.com"),
  title: {
    default: "Ahmed Mohamed Kamel — Video Editor • 3D Artist • Creative Strategist",
    template: "%s — Ahmed Mohamed Kamel",
  },
  description:
    "Premium portfolio of Ahmed Mohamed Kamel — a cinematic video editor, 3D artist, graphic designer and creative strategist crafting world-class visual stories.",
  keywords: [
    "Ahmed Mohamed Kamel",
    "Video Editor",
    "3D Artist",
    "Graphic Designer",
    "Creative Strategist",
    "Motion Graphics",
    "Premiere Pro",
    "After Effects",
    "Blender",
    "DaVinci Resolve",
    "Portfolio",
    "Creative Director",
  ],
  authors: [{ name: "Ahmed Mohamed Kamel" }],
  creator: "Ahmed Mohamed Kamel",
  publisher: "Ahmed Mohamed Kamel",
  openGraph: {
    title: "Ahmed Mohamed Kamel — Creative Portfolio",
    description:
      "Cinematic video editing, 3D design, and creative strategy crafted for world-class brands.",
    url: "https://ahmedmkamel.com",
    siteName: "Ahmed Mohamed Kamel",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ahmed Mohamed Kamel — Creative Portfolio",
    description:
      "Cinematic video editing, 3D design, and creative strategy crafted for world-class brands.",
    creator: "@ahmedmkamel",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0B0B",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch appearance settings server-side so theme is applied on first paint.
  // Falls back to dark mode if DB isn't ready yet.
  let theme
  try {
    theme = await getAppearance()
  } catch {
    theme = {
      mode: 'dark' as const,
      accent: '#00D084',
      accentSoft: '#00FF9D',
      background: '#0B0B0B',
      particleCount: 600,
      gridOpacity: 0.15,
      glowIntensity: 1,
    }
  }

  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <ThemeApplier theme={theme} />
        {children}
        <Toaster />
        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Ahmed Mohamed Kamel",
              jobTitle: "Video Editor, 3D Artist & Creative Strategist",
              url: "https://ahmedmkamel.com",
              sameAs: [
                "https://www.linkedin.com/in/ahmedmkamel",
                "https://www.instagram.com/ahmedmkamel",
              ],
            }),
          }}
        />
        {/* Google Analytics — loaded after page is interactive (non-blocking) */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-R85C6ZG3EW"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-R85C6ZG3EW');
          `}
        </Script>
      </body>
    </html>
  );
}
