"use client";
import { useContext, useEffect, useState } from "react";
import { IoIosPlayCircle } from "react-icons/io";
import SpotifyContext from "../Context/SpotifyContext";
import { useSession } from "next-auth/react";
import { RxShuffle } from "react-icons/rx";
import { ImPrevious2, ImNext2 } from "react-icons/im";
import { BiRepeat, BiVolumeFull } from "react-icons/bi";
import { IoPauseCircle } from "react-icons/io5";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";

const Player = () => {
  const [PlayerData, setPlayerData] = useState(null);
  const [Volume, setVolume] = useState(50); // Default volume set to 50%
  const [sliderValue, setSliderValue] = useState(0);
  const { data: session } = useSession();
  const ContextData = useContext(SpotifyContext);
  const {
    SelectedSong,
    isPlaying,
    setIsPlaying,
    playNextTrack,
    playPreviousTrack,
  } = ContextData;
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [isInteractingWithSlider, setIsInteractingWithSlider] = useState(false);

  const CurrentlyPlayingTrack = async () => {
    try {
      const response = await fetch(
        "https://api.spotify.com/v1/me/player/currently-playing",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.error("Failed to fetch currently playing track");
        return;
      }

      if (response.ok && response.status === 204) {
        alert("Please start a song on Spotify or select a track here.");
        return;
      }

      const data = await response.json();
      setPlayerData(data);
      setIsPlaying(data.is_playing);

      if (!isInteractingWithSlider) {
        const progress = (data.progress_ms / data.item.duration_ms) * 100;
        setSliderValue(progress);
      }
    } catch (error) {
      console.error("Error fetching currently playing track:", error);
    }
  };

  const handleSliderChange = (value) => {
    setIsInteractingWithSlider(true);
    setSliderValue(value[0]);
  };

  const handleSliderChangeEnd = async (value) => {
    if (PlayerData && PlayerData.item && PlayerData.item.duration_ms) {
      const position_ms = Math.floor((value[0] / 100) * PlayerData.item.duration_ms);

      try {
        const response = await fetch(
          `https://api.spotify.com/v1/me/player/seek?position_ms=${position_ms}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200 || response.status === 204) {
          CurrentlyPlayingTrack();
        } else {
          console.error("Error seeking track:", response.statusText);
        }
      } catch (error) {
        console.error("Error seeking track:", error);
      } finally {
        setTimeout(() => {
          setIsInteractingWithSlider(false);
        }, 500);
      }
    }
  };

  const handleVolumeChange = async (value) => {
    const volume = value[0];
    setVolume(volume);

    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/volume?volume_percent=${volume}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to set volume");
      }
    } catch (error) {
      console.error("Error setting volume:", error);
    }
  };

  const togglePlayPause = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/me/player/${isPlaying ? "pause" : "play"}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        setIsPlaying(!isPlaying);
      } else {
        console.error("Failed to toggle play/pause");
      }
    } catch (error) {
      console.error("Error toggling play/pause:", error);
    }
  };

  useEffect(() => {
    if (session) {
      CurrentlyPlayingTrack();

      const pollId = setInterval(() => {
        CurrentlyPlayingTrack();
      }, 5000);
      setPollingIntervalId(pollId);
    }
    return () => clearInterval(pollingIntervalId);
  }, [session]);

  return PlayerData ? (
    <div className="flex justify-around items-center h-full md:px-5 md:justify-between px-1">
      <div className="hidden w-1/3 md:flex justify-start items-center gap-x-3">
        <div>
          <Image
            src={PlayerData?.item?.album?.images[0]?.url}
            className="h-14 w-14 rounded-lg aspect-square"
            height="1000"
            width="1000"
            alt=""
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-y-1">
          <p>{PlayerData?.item?.name}</p>
          <div className="hidden lg:flex gap-x-1">
            {PlayerData?.item?.artists.map((artist, index) => (
              <span className="text-xs" key={index}>
                {artist?.name}
                {index < PlayerData?.item?.artists.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="w-1/2 md:w-1/3 flex flex-col justify-center items-center gap-2 p-1">
        <div className="flex justify-center items-center w-full">
          <Slider
            value={[sliderValue]}
            onValueChange={handleSliderChange}
            onValueCommit={handleSliderChangeEnd}
            max={100}
            step={1}
            className="bg-[#4d4d4d]"
          />
        </div>
        <div className="flex justify-between items-center w-full">
          <RxShuffle
            size="20"
            className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out text"
          />
          <ImPrevious2
            size="20"
            className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out text"
            onClick={playPreviousTrack}
          />
          {isPlaying ? (
            <IoPauseCircle
              size="25"
              className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out"
              onClick={togglePlayPause}
            />
          ) : (
            <IoIosPlayCircle
              size="25"
              className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out"
              onClick={togglePlayPause}
            />
          )}
          <ImNext2
            size="20"
            className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out text"
            onClick={playNextTrack}
          />
          <BiRepeat
            size="20"
            className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out text rotate-180"
          />
        </div>
      </div>
      <div className="w-1/2 flex justify-end items-center space-x-5 md:w-1/3 md:justify-end">
        <BiVolumeFull
          size="20"
          className="hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out"
        />
        <Slider
          value={[Volume]}
          onValueChange={handleVolumeChange}
          max={100}
          step={1}
          className="bg-[#4d4d4d] w-16 md:w-32"
        />
      </div>
    </div>
  ) : (
    <p>Not Available</p>
  );
};

export default Player;
