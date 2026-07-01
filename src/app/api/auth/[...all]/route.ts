import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/integrations/next-js";

export const { GET, POST } = toNextJsHandler(auth);
