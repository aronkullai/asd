import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0b1f33 0%, #1f9d7a 100%)",
          borderRadius: 36,
          color: "white",
          display: "flex",
          fontSize: 72,
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%"
        }}
      >
        PG
      </div>
    ),
    size
  );
}
