"use client";

import { useState, useContext, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import Image from "next/image";
import SpotifyContext from "@/app/Context/SpotifyContext";
import TrackList from "@/app/components/TrackList";
import { shuffle } from "lodash";

const page = ({ params }) => {
  const [SelectedItem, setSelectedItem] = useState(null);
  const [Duration, setDuration] = useState("");
  const [opacity, setOpacity] = useState(1); // Initially set to 1 to ensure visibility
  const [textOpacity, setTextOpacity] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [color, setColor] = useState('');

  const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-yellow-500",
    "from-pink-500",
    "from-purple-500",
  ];

  const { data: session } = useSession();
  console.log("Session:", session);

  const ContextData = useContext(SpotifyContext);

  // console.log("GlobalSelectedItem:", ContextData?.GlobalSelectedItem);


  useEffect(() => {
    setColor(shuffle(colors).pop())
}, [params])


  useEffect(() => {
    const selecteditem = ContextData?.GlobalSelectedItem?.find(item => item.album.id === params?.slug);

    // console.log("Selected item:", selecteditem);
    setSelectedItem(selecteditem);
    setDuration(convertToMinutesAndSeconds(SelectedItem?.album?.tracks?.items[0].duration_ms))
  }, [ContextData]);




  const  convertToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes} min ${seconds} sec`;
}




  return (
    <div className={`min-h-screen w-full rounded-lg `}>
      <section
        className={`h-44 rounded-lg p-1 sticky top-0 transition-opacity duration-300 bg-gradient-to-b to-neutral-900 ${color}`}
      >

        
        <div className="flex justify-end items-center mt-1 mr-1 gap-x-5">
          <Button className="hidden sm:block bg-white text-black font-bold px-5 py-2 rounded-3xl hover:scale-105 hover:bg-[#f0f0f0] hover:text-black duration-150 transition-all ease-in-out cursor-pointer">
            Explore Premium
          </Button>

          <Button
            className="hidden sm:block bg-[#202020] text-white font-bold px-5 py-2 rounded-3xl hover:scale-105 hover:bg-[#202020] hover:text-white duration-150 transition-all ease-in-out cursor-pointer"
            asChild
          >
            <Link
              href="https://www.spotify.com/ca-en/download/windows/"
              target="_blank"
            >
              Install App
            </Link>
          </Button>

          <div
            className="flex justify-center items-center bg-[#222222] rounded-full  h-8 w-8 hover:scale-105 duration-150 transition-all ease-in-out cursor-pointer"
            onClick={() => signOut()}
          >
            <div className="bg-[#19e68c] rounded-full  h-6 w-6 flex justify-center items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-black font-bold">
                      {session?.user?.name.charAt(0)}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{session?.user?.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>

        <div
          className={`flex justify-start items-center gap-x-5 font-semibold transition-opacity duration-300 ${
            isSticky ? "opacity-100" : "opacity-100"
          }`}
        >
          <section>
            {SelectedItem?.album?.images[0]?.url && (
              <Image
                src={SelectedItem?.album?.images[0]?.url || "/placeholder.png"} // Use placeholder if no image
                height="1000"
                width="1000"
                alt=""
                className="h-32 w-32 rounded-lg"
              />
            )}
          </section>
          <section className="flex flex-col justify-between items-start">
            <span className="font-semibold text-base hidden md:block">
              {SelectedItem?.album?.album_type}
            </span>
            <span className="font-semibold text-base">
              {SelectedItem?.album?.name}
            </span>

            <section className="flex justify-start items-center">
              <span className="font-semibold hover:underline hover:cursor-pointer text-base mt-2 sm:mt-0">
                { SelectedItem?.album?.artists[0]?.name}
              </span>
              {SelectedItem && <span className="hidden md:block">&nbsp; &sdot; &nbsp;</span>}
              {/* <span className="font-semibold">&nbsp; &sdot; &nbsp;</span> */}
              {SelectedItem && <span className="font-semibold hidden md:block">
                {SelectedItem?.album?.release_date.split("-")[0]} &sdot; &nbsp;
              </span>}
              
              <span className="font-semibold hidden md:block">{SelectedItem && convertToMinutesAndSeconds(SelectedItem?.album?.tracks?.items[0].duration_ms)}</span>
            </section>
          </section>
        </div>


      </section>

      <div className="">
        <TrackList data={SelectedItem?.album?.tracks?.items} name={SelectedItem?.album?.artists[0]?.name}/>
      </div>
    </div>
  );
}

export default page;
