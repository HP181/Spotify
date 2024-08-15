"use client";
import { signOut, useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import SpotifyContext from "@/app/Context/SpotifyContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Page = () => {
  const [recentTracks, setRecentTracks] = useState([]);
  const { data: session } = useSession();
  const { playTrack } = useContext(SpotifyContext);

  // Fetch recently played tracks
  const getRecentlyPlayedTracks = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=50", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await response.json();
      setRecentTracks(data.items);
    } catch (error) {
      console.error("Error fetching recently played tracks:", error);
    }
  };

  useEffect(() => {
    if (session) {
      getRecentlyPlayedTracks();
    }
  }, [session]);

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between items-center mb-3">
      <h1 className="text-2xl font-bold mb-4">Recently Played Tracks</h1>
      <Button className="bg-green-500" onClick={() => signOut()}>SignOut</Button>

      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {recentTracks.map((item, index) => (
          <div
            key={index}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:bg-gray-700 transition cursor-pointer"
            onClick={() => playTrack(item.track.uri)}
          >
            <Image
              src={item.track.album.images[0]?.url || "/SpotifyAlter.png"}
              alt={item.track.name}
              width={300}
              height={300}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold truncate">{item.track.name}</h2>
              <p className="text-gray-400 truncate">
                {item.track.artists.map(artist => artist.name).join(", ")}
              </p>
              <p className="text-gray-400 text-sm">{item.track.album.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
