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
  // Skip loader on mobile — video doesn't fit portrait well and delays content
  const [showLoader, setShowLoader] = useState(() => {
    if (typeof window === "undefined") return false;
    return !isMobile && !sessionStorage.getItem("loader-played");
  });

  React.useEffect(() => {
    // If on mobile, never show the loader
    if (isMobile) {
      setShowLoader(false);
      return;
    }
    if (sessionStorage.getItem("loader-played")) {
      setShowLoader(false);
    }
  }, [isMobile]);

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
