import React from "react";
import { LOGO_SRC } from "./logoImage.js";

/* Real Vidas logo.
   variant: "full" | "wordmark" (the real lockup image) | "mark" (cropped mark)
   tone: "color" (real logo) | "mono" (white typographic — for dark/brand surfaces)
   `size` = lockup height in px. */

const ASPECT = 700 / 181;     // full image
const MARK_W = 150 / 181;     // mark occupies the left ~150px of the 181-tall art

export function Logo({ variant = "full", tone = "color", size = 40, showTagline = true, style, ...rest }) {
  const mono = tone === "mono";
  const h = Math.round(size * 1.15);

  /* White typographic lockup for dark/brand backgrounds (no white asset exists). */
  if (mono) {
    return (
      <span style={{ display: "inline-flex", flexDirection: "column", lineHeight: 1, color: "#fff", ...style }} {...rest}>
        <span style={{ fontFamily: "var(--font-display)", fontWeight: "var(--fw-extrabold)", fontSize: size * 0.62, letterSpacing: "-0.01em", textTransform: "uppercase" }}>Real Vidas</span>
        {showTagline && variant !== "mark" && (
          <span style={{ fontFamily: "var(--font-body)", fontSize: size * 0.21, fontWeight: "var(--fw-semibold)", letterSpacing: "0.18em", textTransform: "uppercase", marginTop: size * 0.12, opacity: 0.82 }}>Remoções e Emergências 24h</span>
        )}
      </span>
    );
  }

  if (variant === "mark") {
    return (
      <span style={{ display: "inline-block", width: Math.round(h * MARK_W), height: h, overflow: "hidden", ...style }} {...rest}>
        <img src={LOGO_SRC} alt="Real Vidas" style={{ height: h, width: h * ASPECT, maxWidth: "none", objectFit: "cover", objectPosition: "left center", display: "block" }} />
      </span>
    );
  }

  return (
    <img src={LOGO_SRC} alt="Real Vidas — Remoções e Emergências 24h"
      style={{ height: h, width: "auto", display: "block", ...style }} {...rest} />
  );
}
