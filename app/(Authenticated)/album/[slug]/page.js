"use client";

import { useState, useContext, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import SpotifyContext from "@/app/Context/SpotifyContext";
import TrackList from "@/app/components/TrackList";
import { shuffle } from "lodash";
import { Button } from "@/components/ui/button";

const Page = ({ params }) => {
  const [SelectedItem, setSelectedItem] = useState(null);
  const [Duration, setDuration] = useState("");
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
  const ContextData = useContext(SpotifyContext);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [params]);

  useEffect(() => {
    const selecteditem = ContextData?.GlobalSelectedItem?.find(item => item.album.id === params?.slug);
    const sid = ContextData?.GlobalSelectedItem?.findIndex(item => item.album.id === params?.slug);
    setSelectedItem(selecteditem);
   ContextData?.setSidebarId(sid);

    if (selecteditem) {
      setDuration(convertToMinutesAndSeconds(selecteditem.album.tracks.items[0].duration_ms));
    }
  }, [ContextData, params]);

  useEffect(() => {
    console.log("selecteditem", SelectedItem);
    console.log("ss", session);
  }, [SelectedItem])

  const convertToMinutesAndSeconds = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div className={`min-h-screen w-full rounded-lg`}>
      <section className={`h-44 rounded-lg p-1 sticky top-0 transition-opacity duration-300 bg-gradient-to-b to-neutral-900 ${color}`}>
        <div className="flex justify-end items-center mt-1 mr-1 gap-x-5">
          {/* Add your buttons here */}
          <Button onClick={() => signOut()}>Logout</Button>
        </div>

        <div className="flex justify-start items-center gap-x-5 font-semibold transition-opacity duration-300">
          <section>
            {SelectedItem?.album?.images[0]?.url && (
              <Image
                src={SelectedItem?.album?.images[0]?.url || "/placeholder.png"}
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
              {SelectedItem && <span className="font-semibold hidden md:block">
                {SelectedItem?.album?.release_date.split("-")[0]} &sdot; &nbsp;
              </span>}
              <span className="font-semibold hidden md:block">
                {SelectedItem && convertToMinutesAndSeconds(SelectedItem?.album?.tracks?.items[0].duration_ms)}
              </span>
            </section>
          </section>
        </div>
      </section>

      <div className="">
        <TrackList data={SelectedItem?.album?.tracks?.items} />
      </div>
    </div>
  );
}

export default Page;
