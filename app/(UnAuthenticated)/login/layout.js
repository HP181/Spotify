import "@/app/globals.css";
import { NextAuthProvider } from "@/Providers/NextAuthProvider";
import { Montserrat } from "next/font/google";
import { getServerSession } from "next-auth";

const fontFamily = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "Login with Spotify",
  description: "Login page to authenticate through Spotify",
};

export default async function LoginPageLayout({
  children,
}) {

  const session = await getServerSession();

  return (
    <html lang="en">
      <NextAuthProvider session={session}>
        <body className={fontFamily.className + " text-white bg-black"}>
          <main>{children}</main>
        </body>
      </NextAuthProvider>
    </html>
  );
}
