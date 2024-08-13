"use client"
import React, { useEffect, useState } from "react";
import SpotifyContext from "./SpotifyContext";
import { usePathname } from 'next/navigation'
import { useSession } from "next-auth/react";

const SpotifyState = (props) => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const [Token, setToken] = useState("");
  const [UserName, setUserName] = useState("");
  const [GlobalSelectedItem, SetGlobalSelectedItem] = useState([]);
  const [SelectedAlbumIndex, SetSelectedAlbumIndex] = useState(null);
  const [SelectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [SidebarId, setSidebarId] = useState(null);

  //PlayList
  const [SidebarPlayListId, setSidebarPlayListId] = useState(null);
  const [PlayListData, setPlayListData] = useState(null);
  const [GlobalPlayListData, setGlobalPlayListData] = useState(null);

  const [PlayListTrackIndex, setPlayListTrackIndex] = useState(null);
  const [SelectedPlayListURI, setSelectedPlayListURI] = useState(null);
  const [SelectedPlayListSong, setSelectedPlayListSong] = useState(null);

  useEffect(() => {
    console.log("g", GlobalPlayListData);
  })


  const playTrack = async (uri, index) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [uri] }),
      });


      setSelectedPlayListSong(uri),
        setPlayListTrackIndex(index)

      if (response.ok) {
        if (pathname.split('/')[1] === "album") {
          setSelectedSong(uri),
            SetSelectedAlbumIndex(index)
        } else if (pathname.split('/')[1] === "playlist") {
          setSelectedPlayListSong(uri),
            setPlayListTrackIndex(index)
        }

        setIsPlaying(true);
      } else {
        console.error("Failed to play track");
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  };




  const playNextTrack =async () => {

    if (pathname.split('/')[1] === "album") {
      if (SelectedAlbumIndex !== null && SelectedAlbumIndex < GlobalSelectedItem[SidebarId]?.album?.tracks?.items.length - 1) {
        console.log("sele", SelectedAlbumIndex);
        const nextIndex = SelectedAlbumIndex + 1;
        console.log("GlobalSelectedItem", GlobalSelectedItem);
        console.log("nextIndex", nextIndex);
        console.log("SelectedAlbumIndex", SelectedAlbumIndex);
        const nextTrackUri = GlobalSelectedItem[SidebarId]?.album?.tracks?.items[nextIndex]?.uri;
        playTrack(nextTrackUri, nextIndex);
      } else {
        console.log("No next track available or playlist is empty 1.");
      }
    } else {
      if (pathname.split('/')[1] === "playlist") {


        const SkipToNext = async () => {
          try {
            const response = await fetch(
              "https://api.spotify.com/v1/me/player/next",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.status === 200 || response.status === 204) {
              // setSliderValue(0);
              // CurrentlyPlayingTrack();
            } else {
              console.error("Failed to skip to the next track");
            }
          } catch (error) {
            console.error("Error skipping to the next track:", error);
          }
        };

        await SkipToNext();
        {
          console.log("No next track available or playlist is empty. 2");
        }
      }
    }

  };

  const playPreviousTrack = async  () => {

    if(pathname.split('/')[1] === "album"){

      if (SelectedAlbumIndex !== null && SelectedAlbumIndex > 0) {
        const prevIndex = SelectedAlbumIndex - 1;
        const prevTrackUri = GlobalSelectedItem[SidebarId]?.album?.tracks?.items[prevIndex]?.uri;
        playTrack(prevTrackUri, prevIndex);
      } else {
        console.log("No previous track available or playlist is empty.");
      }
    }
    else if(pathname.split('/')[1] === "playlist"){
      const SkipToPrevious = async () => {
        try {
            const response = await fetch(
                "https://api.spotify.com/v1/me/player/previous",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${session?.accessToken}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200 || response.status === 204) {
                // setSliderValue(0); 
                // CurrentlyPlayingTrack(); 
            } else {
                console.error("Failed to skip to the previous track");
            }
        } catch (error) {
            console.error("Error skipping to the previous track:", error);
        }
    };

    await SkipToPrevious();

    }
  };



  const PlayPlayListTracks = async (URI, Index) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/me/player/play`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uris: [URI] }),
      });

      if (response.ok) {
        setSelectedPlayListSong(URI);
        setPlayListTrackIndex(Index);
        setIsPlaying(true);
      } else {
        console.error("Failed to play track");
      }
    } catch (error) {
      console.error("Error playing track:", error);
    }
  }

  return (
    <SpotifyContext.Provider
      value={{
        Token,
        setToken,
        GlobalSelectedItem,
        SetGlobalSelectedItem,
        UserName,
        setUserName,
        SelectedSong,
        setSelectedSong,
        isPlaying,
        setIsPlaying,
        SelectedAlbumIndex,
        SetSelectedAlbumIndex,
        playTrack,
        playNextTrack,
        playPreviousTrack,
        SidebarId,
        setSidebarId,
        SidebarPlayListId,
        setSidebarPlayListId,
        PlayListData,
        setPlayListData,
        PlayListTrackIndex,
        setPlayListTrackIndex,
        SelectedPlayListURI,
        setSelectedPlayListURI,
        PlayPlayListTracks,
        SelectedPlayListSong,
        setSelectedPlayListSong,
        GlobalPlayListData,
        setGlobalPlayListData
      }}
    >
      {props.children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyState;
