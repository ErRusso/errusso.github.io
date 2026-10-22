import type { NextConfig } from "next";

/**
 * Static export: the site is deployed to GitHub Pages.
 * When a custom domain arrives, only `site.url` in lib/site.ts changes.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Testing `bun dev` from a phone on the same Wi-Fi: without this, Next blocks
  // the dev client (and hydration) when the page is opened from the LAN IP.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.16.*.*", "*.local"],
  // Don't generate AGENTS.md on `next dev`; the repo stays focused on the site.
  agentRules: false,
};

export default nextConfig;
