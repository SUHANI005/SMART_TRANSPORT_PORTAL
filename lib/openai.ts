import OpenAI from "openai";

// Server-side only. Never expose OPENAI_API_KEY to the client.
// If no key is configured, ai() throws a clear error that API routes
// catch and turn into a friendly "assistant unavailable" response,
// so the rest of the app still works without an OpenAI key set.
export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key || key.startsWith("sk-...")) {
    throw new Error("OPENAI_API_KEY is not configured on the server.");
  }
  return new OpenAI({ apiKey: key });
}
