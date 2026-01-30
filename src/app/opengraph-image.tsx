import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Sully Ruiz - Texas Real Estate Expert";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
        }}
      >
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
          {/* Name */}
          <div
            style={{
              fontSize: "80px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "4px",
              marginBottom: "20px",
              fontFamily: "serif",
            }}
          >
            SULLY RUIZ
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: "32px",
              fontWeight: "500",
              color: "#BEB09E",
              letterSpacing: "6px",
              marginBottom: "40px",
              textTransform: "uppercase",
            }}
          >
            Texas Real Estate Expert
          </div>

          {/* Decorative line */}
          <div
            style={{
              width: "120px",
              height: "2px",
              background: "#BEB09E",
              marginBottom: "40px",
            }}
          />

          {/* Service areas */}
          <div
            style={{
              fontSize: "20px",
              color: "#a0a0a0",
              letterSpacing: "2px",
              display: "flex",
              gap: "20px",
            }}
          >
            <span>Austin</span>
            <span>•</span>
            <span>Round Rock</span>
            <span>•</span>
            <span>Cedar Park</span>
            <span>•</span>
            <span>Georgetown</span>
          </div>
        </div>

        {/* Bottom contact info */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            display: "flex",
            alignItems: "center",
            gap: "30px",
            fontSize: "18px",
            color: "#808080",
          }}
        >
          <span>(512) 412-2352</span>
          <span>•</span>
          <span>realtor@sullyruiz.com</span>
          <span>•</span>
          <span>sullyruiz.com</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
