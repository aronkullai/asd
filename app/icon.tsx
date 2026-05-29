import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #0b1f33 0%, #14755b 100%)",
          color: "white",
          display: "flex",
          fontSize: 13,
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
