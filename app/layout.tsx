import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/layout/theme-provider";
import Script from "next/script";

import { SessionProvider } from "@/components/providers/session-provider";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 700",
});

export const metadata: Metadata = {
  title: {
    default: "Cody - Learning Management System",
    template: "%s | Cody LMS",
  },
  description:
    "Master new skills with Cody's comprehensive learning management system. Access courses, track progress, and achieve your learning goals.",
  keywords: [
    "learning management system",
    "online courses",
    "education",
    "skill development",
    "e-learning",
    "Cody",
  ],
  authors: [{ name: "Cody Team" }],
  creator: "Cody LMS",
  publisher: "Cody",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cody-lms.vercel.app",
    siteName: "Cody LMS",
    title: {
      default: "Cody - Learning Management System",
      template: "%s | Cody LMS",
    },
    description:
      "Master new skills with Cody's comprehensive learning management system. Access courses, track progress, and achieve your learning goals.",
    images: [
      {
        url: "/graduation.ico",
        width: 1200,
        height: 630,
        alt: "Cody Learning Management System",
      },
    ],
  },

  icons: {
    icon: [{ url: "/graduation.ico", sizes: "any" }],
    apple: [{ url: "/graduation.ico", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  category: "education",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script
          src="https://upload-widget.cloudinary.com/latest/global/all.js"
          type="text/javascript"
          strategy="beforeInteractive"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  var valid = ['light','dark','blue','red'];
                  if (!t || !valid.includes(t)) {
                    t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  document.documentElement.classList.add(t);
                  document.documentElement.setAttribute('data-theme', t);
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} ${spaceGrotesk.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>{children}</SessionProvider>
        </ThemeProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
