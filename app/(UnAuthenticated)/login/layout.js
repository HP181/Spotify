import "@/app/globals.css";
import { NextAuthProvider } from "@/Providers/NextAuthProvider";
import { Montserrat } from "next/font/google";

const fontFamily = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Login with Spotify",
  description: "Login page to authenticate through Spotify",
};

export default function LoginPageLayout({
  children,
}) {
  return (
    <html lang="en">
      <NextAuthProvider>
        <body className={fontFamily.className + " text-white bg-black"}>
          <main>{children}</main>
        </body>
      </NextAuthProvider>
    </html>
  );
}
