"use client";
import SpotifyContext from "@/app/Context/SpotifyContext";
import ConverToMinutesAndSecondsAndDigits from "@/lib/ConverToMinutesAndSecondsAndDigits";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";

const PlayListTracks = ({id}) => {
    const [TracksData, setTracksData] = useState(null)
    // const { PlayPlayListTracks, SelectedPlayListSong } = useContext(SpotifyContext);
    const { playTrack, SelectedSong, setGlobalPlayListData } = useContext(SpotifyContext);

    const { data: session } = useSession();

    const GetTracks = async () => {
        const data = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
            method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        })
        
        const response = await data?.json();
        setTracksData(response.items)
        setGlobalPlayListData(response?.items)
        console.log("getData res:", response);
    }

    useEffect(() => {
        if(session){

            GetTracks();
        }
    }, [session])

  return (
    <div className="text-white p-6 rounded-lg">
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs uppercase text-gray-400 md:text-sm">
            <th className="w-10 p-2">#</th>
            <th className="p-2">Title</th>
            <th className="hidden md:table-cell p-2">Album</th>
            <th className="w-20 p-2 text-right">Duration</th>
          </tr>
        </thead>
        <tbody>
          {TracksData?.map((track, index) => (
            <tr
              key={index}
              className={`group transition-all ease-in-out ${SelectedSong === track?.track?.uri ? "text-[#1ed760]" : ""}`}
              onClick={() => playTrack(track?.track?.uri, index)}
            >
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer group-hover:rounded-l-lg transition-all  ease-in-out">
                {index + 1}
              </td>
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all  ease-in-out">
                {track?.track?.name}
              </td>
              <td className="hidden md:table-cell p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all  ease-in-out">
                {track?.track?.album?.name}
              </td>
              <td className="p-2 text-center group-hover:bg-gray-800 group-hover:rounded-r-lg group-hover:cursor-pointer transition-all  ease-in-out">
                {ConverToMinutesAndSecondsAndDigits(track?.track?.duration_ms)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayListTracks;