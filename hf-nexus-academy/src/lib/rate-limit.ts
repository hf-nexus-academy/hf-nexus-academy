import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const limiters = new Map<string, Ratelimit>();

function getLimiter(name: string, requests: number, windowSeconds: number) {
  if (!redis) return null;

  const cacheKey = `${name}:${requests}:${windowSeconds}`;
  const existing = limiters.get(cacheKey);
  if (existing) return existing;

  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, `${windowSeconds} s`),
    prefix: `hf-nexus:${name}`,
  });
  limiters.set(cacheKey, limiter);
  return limiter;
}

/**
 * Rate-limits a request by client IP. Returns `null` (meaning "allowed") when
 * Upstash isn't configured — this lets local development and preview builds
 * without Redis env vars keep working, while production (which should always
 * have Upstash configured) gets real protection.
 */
export async function checkRateLimit(
  req: Request,
  name: string,
  { requests = 5, windowSeconds = 60 }: { requests?: number; windowSeconds?: number } = {}
): Promise<{ success: boolean; remaining: number } | null> {
  const limiter = getLimiter(name, requests, windowSeconds);
  if (!limiter) return null;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  const result = await limiter.limit(`${name}:${ip}`);
  return { success: result.success, remaining: result.remaining };
}

export function rateLimitResponse() {
  return Response.json(
    { error: "Too many requests. Please wait a moment and try again." },
    { status: 429 }
  );
}
