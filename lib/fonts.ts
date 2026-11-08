import localFont from "next/font/local";

/*
 * Self-hosted variable fonts. `next/font/google` fetches the CSS at build time,
 * and Google occasionally returns extensionless font URLs that Turbopack cannot
 * resolve. That flake fails the whole deploy, so the files live in this repo.
 *
 * Source: @fontsource-variable 5.3.0 (which republishes the Google Fonts files).
 * Each family ships its SIL Open Font License beside the .woff2.
 */
export const archivo = localFont({
  src: "../fonts/archivo-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-archivo",
  display: "swap",
});

export const inter = localFont({
  src: "../fonts/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});

export const jetbrains = localFont({
  src: "../fonts/jetbrains-mono-latin-wght-normal.woff2",
  weight: "100 800",
  variable: "--font-jetbrains",
  display: "swap",
});

export const fontVariables = `${archivo.variable} ${inter.variable} ${jetbrains.variable}`;
