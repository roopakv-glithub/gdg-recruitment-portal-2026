// Explicitly opt in locally; this can never enable demo auth in production.
export const demoMode = process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_DEMO_MODE === "true";
