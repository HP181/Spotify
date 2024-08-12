"use client";

import { usePathname } from "next/navigation";
import { MdHomeFilled } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { BiLibrary } from "react-icons/bi";
import { IoAdd } from "react-icons/io5";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SpotifyContext from "../Context/SpotifyContext";

const Sidebar = () => {
  const [data, setData] = useState(null);
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const ContextData = useContext(SpotifyContext);

  const getDataa = async () => {
    try {
      const getData = await fetch("https://api.spotify.com/v1/albums/1QOwvBk3LNWAaEvARxPDNd", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!getData.ok) {
        throw new Error(`Failed to fetch data: ${getData.statusText}`);
      }

      const data = await getData.json();
      setData(data);
      ContextData.setToken(session?.accessToken);
      ContextData.setPlaylist(data);
      ContextData.setUserName(session?.user?.name);
    } catch (error) {
      console.error("Error fetching album data:", error);
    }
  };

  useEffect(() => {
    if (session) {
      getDataa();
    }
  }, [session]);

  useEffect(() => {
    if (data) {
      console.log("Album data:", data);
    }
  }, [data]);

  return (
    <div className="h-[87vh] flex flex-col justify-between items-center flex-1 p-1">
      <Link
        href="/"
        className={
          pathname === "/"
            ? "flex justify-between items-center gap-x-3 text-xs text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"
            : "flex justify-between items-center gap-x-3 text-xs text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"
        }
      >
        <MdHomeFilled size="24" />
        <p className="hidden sm:block font-semibold">Home</p>
      </Link>

      <Link
        href="/search"
        className={
          pathname === "/search"
            ? "flex justify-between items-center gap-x-3 text-xs text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"
            : "flex justify-between items-center gap-x-3 text-xs text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"
        }
      >
        <IoIosSearch size="24" />
        <p className="hidden sm:block font-semibold">Search</p>
      </Link>

      <section className="flex justify-between items-center  text-xs sm:text-lg lg:gap-x-5">
        <div className="flex justify-between items-center gap-x-2 text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out">
          <BiLibrary size="24" className="hidden" />
          <p className="hidden sm:block font-semibold">Your Library</p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IoAdd
                size="24"
                className="text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out"
              />
            </TooltipTrigger>
            <TooltipContent>
              <p className="hidden sm:block text-white font-semibold text-md">
                Create Playlist
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </section>

      {data && (
        <section
          className="flex justify-between items-center gap-2 hover:cursor-pointer hover:bg-[#2a2a2a]  rounded-lg lg:p-3"
          onClick={() => router.push(`/album/${data.id}`)}
        >
          <section>
            <Image
              src={data.images[0].url}
              width="1000"
              height="1000"
              alt={`${data.artists[0].name} pic`}
              className="h-10 w-10 object-contain lg:mr-1"
            />
          </section>
          <section>
            <p className="hidden lg:block text-xs text-white font-bold truncate">
              {data.name}
            </p>
            <p className="hidden lg:block text-xs text-[#b3b3b3]">
              {data.type} &sdot; {data.artists[0].name}
            </p>
          </section>
        </section>
      )}
    </div>
  );
};

export default Sidebar;








