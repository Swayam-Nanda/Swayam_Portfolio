import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { MusicProvider } from "../lib/MusicContext";
import { ThemeProvider } from "../lib/ThemeContext";
import { MusicPlayer } from "../components/MusicPlayer";
import appCss from "../styles.css?url";
import TargetCursor from "../components/ui/TargetCursor";
import VideoLoader from "../components/VideoLoader";
import { useIsMobile } from "../hooks/use-mobile";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Swayam Nanda | Full Stack Developer & AI Builder" },
      {
        name: "description",
        content:
          "Swayam Nanda is a Full Stack Developer, AI Builder, and Creative Engineer crafting premium digital experiences.",
      },
      { name: "author", content: "Swayam Nanda" },
      { property: "og:title", content: "Swayam Nanda | Portfolio" },
      {
        property: "og:description",
        content:
          "Full Stack Developer specializing in AI integration, UI engineering, and high-performance web applications.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@swayam_nanda" },
    ],
    scripts: [
      {
        children: `
          (function() {
            try {
              var savedTheme = localStorage.getItem("portfolio-theme");
              if (savedTheme) {
                document.documentElement.setAttribute("data-theme", savedTheme);
              }
            } catch (e) {}
          })();
        `,
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <HeadContent />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Anton&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        {children}
        <MobileAwareCursor />
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const isMobile = useIsMobile();
  // Safe initial state for both Server (SSR) and Client first render to prevent React Error #418
  const [showLoader, setShowLoader] = useState(true);
  const [showMobileDialog, setShowMobileDialog] = useState(false);

  React.useEffect(() => {
    // Only bypass if already played, show loader on mobile as well
    if (sessionStorage.getItem("loader-played")) {
      setShowLoader(false);
    }
  }, []);

  React.useEffect(() => {
    // If loader is finished and it is mobile, show the desktop recommendation alert
    if (!showLoader && isMobile && !sessionStorage.getItem("mobile-dialog-dismissed")) {
      setShowMobileDialog(true);
    }
  }, [showLoader, isMobile]);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    sessionStorage.setItem("loader-played", "true");
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <MusicProvider>
          {showLoader && <VideoLoader onComplete={handleLoaderComplete} />}
          <div
            style={{
              visibility: showLoader ? "hidden" : "visible",
              height: showLoader ? "100vh" : "auto",
              overflow: showLoader ? "hidden" : "visible",
            }}
          >
            <MusicPlayer />
            <Outlet />
          </div>

          <AnimatePresence>
            {showMobileDialog && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full max-w-sm rounded-3xl border border-white/10 bg-black/80 p-6 text-center shadow-2xl backdrop-blur-md"
                >
                  <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"
                      />
                    </svg>
                  </div>
                  <h3 className="font-display text-xl font-bold text-white mb-2">
                    Desktop Recommended
                  </h3>
                  <p className="text-white/60 text-xs leading-relaxed mb-6">
                    This site features heavy 3D WebGL scenes, interactive canvas layouts, and custom shaders that are best experienced on a desktop or laptop computer.
                  </p>
                  <button
                    onClick={() => {
                      setShowMobileDialog(false);
                      sessionStorage.setItem("mobile-dialog-dismissed", "true");
                    }}
                    className="w-full rounded-full py-2.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: "var(--gradient-primary)",
                      boxShadow: "var(--shadow-glow)",
                    }}
                  >
                    Enter Anyway
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </MusicProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/** Renders the custom pointer cursor only on non-touch (desktop) devices */
function MobileAwareCursor() {
  const isMobile = useIsMobile();
  if (isMobile) return null;
  return (
    <TargetCursor
      targetSelector="a, button, .cursor-target, [role='button']"
      spinDuration={3}
      hoverDuration={0.15}
    />
  );
}
