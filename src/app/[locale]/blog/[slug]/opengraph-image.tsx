import { ImageResponse } from "next/og";
import { getPostMeta } from "@/lib/blog";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const meta = await getPostMeta(slug);

  const title = meta?.title || slug;
  const category = meta?.category
    ?.split("-")
    .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ") || "Blog";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px",
          background: "linear-gradient(135deg, #0d9488 0%, #065f5b 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.2)",
              padding: "6px 16px",
              borderRadius: "999px",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            {category}
          </div>
        </div>
        <div
          style={{
            fontSize: title.length > 60 ? "42px" : "52px",
            fontWeight: 700,
            lineHeight: 1.2,
            maxWidth: "900px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: "24px", fontWeight: 600 }}>
            Sully Ruiz Real Estate
          </div>
          <div style={{ fontSize: "18px", opacity: 0.8 }}>sullyruiz.com</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
