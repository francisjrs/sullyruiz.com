import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Free Homebuyer Consultation - Sully Ruiz";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isSpanish = locale === "es";

  const headline = isSpanish
    ? "El Banco Dijo No."
    : "The Bank Said No.";

  const subheadline = isSpanish
    ? "Yo Digo Hablemos."
    : "I Say Let's Talk.";

  const tagline = isSpanish
    ? "CONSULTA GRATIS"
    : "FREE CONSULTATION";

  const description = isSpanish
    ? "ITIN • Autoempleados • Ingresos No Tradicionales"
    : "ITIN • Self-Employed • Non-Traditional Income";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 50%, #1a1a1a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
          position: "relative",
        }}
      >
        {/* Decorative accent circles */}
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: "40px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            background: "rgba(190, 176, 158, 0.1)",
            filter: "blur(40px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "60px",
            right: "60px",
            width: "250px",
            height: "250px",
            borderRadius: "50%",
            background: "rgba(190, 176, 158, 0.1)",
            filter: "blur(50px)",
          }}
        />

        {/* Main content container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          {/* Tagline badge */}
          <div
            style={{
              fontSize: "18px",
              fontWeight: "600",
              color: "#BEB09E",
              letterSpacing: "6px",
              marginBottom: "30px",
              textTransform: "uppercase",
              padding: "10px 24px",
              border: "1px solid rgba(190, 176, 158, 0.4)",
            }}
          >
            {tagline}
          </div>

          {/* Main headline */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "2px",
              marginBottom: "10px",
              fontFamily: "serif",
            }}
          >
            {headline}
          </div>

          {/* Subheadline */}
          <div
            style={{
              fontSize: "72px",
              fontWeight: "700",
              color: "#BEB09E",
              letterSpacing: "2px",
              marginBottom: "40px",
              fontFamily: "serif",
            }}
          >
            {subheadline}
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "#BEB09E",
              marginBottom: "30px",
            }}
          />

          {/* Description */}
          <div
            style={{
              fontSize: "22px",
              color: "#a0a0a0",
              letterSpacing: "3px",
            }}
          >
            {description}
          </div>
        </div>

        {/* Bottom info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            fontSize: "20px",
            color: "#ffffff",
          }}
        >
          <span style={{ fontWeight: "600", letterSpacing: "2px" }}>SULLY RUIZ</span>
          <span style={{ color: "#BEB09E" }}>•</span>
          <span style={{ color: "#808080" }}>sullyruiz.com/consulta</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
