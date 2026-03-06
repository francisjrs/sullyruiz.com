import { timingSafeEqual } from "crypto";

export function validateApiKey(authHeader: string | null): boolean {
  const expectedKey = process.env.BLOG_PUBLISH_API_KEY;
  if (!expectedKey || !authHeader) return false;

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : "";

  if (!token || token.length !== expectedKey.length) return false;

  try {
    return timingSafeEqual(
      Buffer.from(token),
      Buffer.from(expectedKey)
    );
  } catch {
    return false;
  }
}
