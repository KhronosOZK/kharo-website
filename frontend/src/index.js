import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "@/index.css";
import App from "@/App";
import { inject } from "@vercel/analytics";
import * as Sentry from "@sentry/react";

// Real page views, once Web Analytics is switched on in the Vercel project.
// Does nothing outside Vercel.
inject();

// Error reporting. Silent until REACT_APP_SENTRY_DSN is set in Vercel's
// environment; then every crash on a real visitor's screen reaches you.
if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({ dsn: process.env.REACT_APP_SENTRY_DSN, tracesSampleRate: 0.1, environment: process.env.NODE_ENV });
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>,
);
