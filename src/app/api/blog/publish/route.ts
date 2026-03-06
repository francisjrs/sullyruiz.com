import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateApiKey } from "@/lib/blog-auth";
import { publishSchema, sanitizeMdxContent } from "@/lib/blog-validation";
import { checkRateLimit } from "@/lib/blog-rate-limit";
import { writePost, updateIndex } from "@/lib/blog";

export async function POST(request: Request) {
  // Auth
  const authHeader = request.headers.get("authorization");
  if (!validateApiKey(authHeader)) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Rate limit
  const apiKey = authHeader!.slice(7);
  const rateCheck = checkRateLimit(apiKey);
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded", retryAfter: rateCheck.retryAfter },
      {
        status: 429,
        headers: { "Retry-After": String(rateCheck.retryAfter) },
      }
    );
  }

  // Parse & validate
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const result = publishSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Validation failed", details: result.error.flatten() },
      { status: 400 }
    );
  }

  const payload = result.data;

  // Sanitize content
  payload.content = sanitizeMdxContent(payload.content);

  // Check if this is an update (existing file)
  const { getPostContent } = await import("@/lib/blog");
  const existing = await getPostContent(payload.slug, payload.locale);
  const isUpdate = !!existing;

  try {
    await writePost(payload);
    await updateIndex(payload.slug);

    // Revalidate cached pages
    revalidatePath("/blog");
    revalidatePath(`/blog/${payload.slug}`);
    revalidatePath("/es/blog");
    revalidatePath(`/es/blog/${payload.slug}`);
    revalidatePath("/sitemap.xml");

    return NextResponse.json(
      {
        success: true,
        slug: payload.slug,
        locale: payload.locale,
        action: isUpdate ? "updated" : "created",
      },
      { status: isUpdate ? 200 : 201 }
    );
  } catch (error) {
    console.error("Blog publish error:", error);
    return NextResponse.json(
      { error: "Failed to publish post" },
      { status: 500 }
    );
  }
}
