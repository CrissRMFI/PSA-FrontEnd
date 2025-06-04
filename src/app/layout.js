import { Roboto_Condensed } from "next/font/google";
import "./globals.css";

const robotoCondensed = Roboto_Condensed({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto-condensed",
});

export const metadata = {
  title: "PSA - Project",
  description: "Proyecto PSA - Ingenieria de Software",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${robotoCondensed.variable} antialiased text-[#444444]`}
      >
        {children}
      </body>
    </html>
  );
}
