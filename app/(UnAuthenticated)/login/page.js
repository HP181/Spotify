"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {

  return (
    <div className="flex flex-col items-center justify-center max-w-xl m-auto p-3 h-screen gap-10">
      <Image
        src="/Spotify.svg"
        alt="spotify logo"
        width={320}
        height={96}
        className="invert"
      />
      <button
        className="flex px-12 py-2 text-xl tracking-widest bg-[#19e68c] uppercase rounded-full focus:outline-none hover:bg-opacity-90"
        onClick={() => signIn("spotify", { callbackUrl: process.env.NEXT_PUBLIC_URL})}
      >
        Login
      </button>
    </div>
  );
}
