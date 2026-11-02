// App's External Imports
import { Archivo_Black, EB_Garamond } from "next/font/google";

// Fonts for the poster-style winner photos, only loaded on the winners pages
const poster_font = Archivo_Black({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-poster" });
const serif_font = EB_Garamond({ subsets: ["latin"], weight: "400", display: "swap", variable: "--font-serif" });

const Genesis2WinnersLayout = ({ children }) => (
  <div className={`${poster_font.variable} ${serif_font.variable}`}>{children}</div>
);

export default Genesis2WinnersLayout;
