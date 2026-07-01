"use client";

import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : "",
  fetch: typeof window !== "undefined" ? window.fetch.bind(window) : undefined,
});
