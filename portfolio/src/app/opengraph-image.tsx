import { ImageResponse } from "next/og";

export const alt = "Quanngynx portfolio and writing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#05080d",
        color: "white",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        width: "100%",
      }}
    >
      <div
        style={{
          background: "#22d3ee",
          borderRadius: 999,
          display: "flex",
          filter: "blur(100px)",
          height: 360,
          opacity: 0.2,
          position: "absolute",
          right: -80,
          top: -120,
          width: 360,
        }}
      />
      <div
        style={{
          border: "1px solid rgba(255,255,255,0.14)",
          display: "flex",
          flexDirection: "column",
          height: 510,
          justifyContent: "space-between",
          padding: "64px 72px",
          width: 1080,
        }}
      >
        <div
          style={{
            color: "#22d3ee",
            display: "flex",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 8,
          }}
        >
          QUANNGYNX
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 82,
              fontWeight: 800,
              letterSpacing: -4,
              lineHeight: 1,
            }}
          >
            PORTFOLIO / WRITING
          </div>
          <div
            style={{
              color: "rgba(255,255,255,0.6)",
              display: "flex",
              fontSize: 26,
              letterSpacing: 2,
            }}
          >
            kuanngyn.io.vn
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
