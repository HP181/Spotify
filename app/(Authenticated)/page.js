"use client"
import { useState, useContext, useEffect } from 'react';
import { useSession } from "next-auth/react";
import SpotifyContext from '../Context/SpotifyContext';
import SidebarCards from '../components/Sidebar/SidebarCards';
import PlayListCards from '../components/PlayLists/PlayListCards';

export default function Component() {
  const [data, setData] = useState(null);
  const [PlayListdata, setPlayListdata] = useState(null);

  const { data: session } = useSession();
  const ContextData = useContext(SpotifyContext);

  const getDataa = async () => {
    try {
      const getData = await fetch("https://api.spotify.com/v1/me/albums", {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!getData.ok) {
        throw new Error(`Failed to fetch data: ${getData.statusText}`);
      }

      const data = await getData.json();
      setData(data?.items);
      ContextData.setToken(session?.accessToken);
      ContextData.SetGlobalSelectedItem(data?.items);
      ContextData.setUserName(session?.user?.name);
    } catch (error) {
      console.error("Error fetching album data:", error);
    }
  };

  const getPlaylists = async () => {
    try {
      const data = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "get",
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      })

      const response = await data?.json();
      setPlayListdata(response);
      console.log("pl res", response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (session) {
      getDataa();
      getPlaylists();
    }
  }, [session]);

  return (
    <div className="h-[85vh] w-full rounded-lg p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 h-full">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <SidebarCards data={data} />
          <PlayListCards data={PlayListdata} />
        </div>
       
      </div>
    </div>
  );
}
