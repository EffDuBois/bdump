import { DM_Serif_Display, Indie_Flower, Inter, Lora } from "next/font/google";

export const maintextFont = Lora({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const interfaceFont = Inter({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const subtextFont = Indie_Flower({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const titleFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
