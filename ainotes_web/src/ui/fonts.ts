import { DM_Serif_Display, Handlee, Inter, Lora } from "next/font/google";

export const maintextFont = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});
export const interfaceFont = Inter({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const subtextFont = Handlee({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const titleFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  preload: false,
});
