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
import { useSession } from "next-auth/react";
import SpotifyContext from "../Context/SpotifyContext";
import SidebarCards from "./Sidebar/SidebarCards";
import PlayListCards from "./PlayLists/PlayListCards";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Sidebar = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [data, setData] = useState(null);
  const [PlayListdata, setPlayListdata] = useState(null);
  const [userId, setUserId] = useState(null); // New state to store the user ID
  const pathname = usePathname();
  const { data: session } = useSession();
  const ContextData = useContext(SpotifyContext);

  // Fetch user data to get the user ID
  const getUserData = async () => {
    try {
      const response = await fetch("https://api.spotify.com/v1/me", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.statusText}`);
      }
      const userData = await response.json();
      setUserId(userData.id); // Store the user ID in state
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fetch album data
  const getDataa = async () => {
    try {
      const getData = await fetch("https://api.spotify.com/v1/me/albums", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
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

  // Form validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Playlist Name is required";
    } else if (name.length < 3) {
      newErrors.name = "Playlist Name must be at least 3 characters long";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle playlist creation
  const handleCreatePlaylist = async ({ name, description }) => {
    try {
      if (!userId) {
        console.error("User ID not found");
        return;
      }
      const response = await fetch(
        `https://api.spotify.com/v1/users/${userId}/playlists`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            description,
            public: false,
          }),
        }
      );
      if (response.ok) {
        await getPlaylists(); // Refresh the playlist list after creation
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      await handleCreatePlaylist({ name, description });
      setName(""); // Reset form after submission
      setDescription("");
      setErrors({});
    }
  };

  // Fetch user playlists
  const getPlaylists = async () => {
    try {
      const data = await fetch("https://api.spotify.com/v1/me/playlists", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const response = await data?.json();
      setPlayListdata(response);
      console.log("Playlists:", response);
    } catch (error) {
      console.log("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    if (session) {
      getUserData(); // Fetch user data and set user ID
      getDataa();
      getPlaylists();
    }
  }, [session]);

  return (
    <div className="h-[87vh] flex flex-col justify-between items-center flex-1 p-1">
      {/* Navigation Links */}
      <section className="h-44 flex flex-col justify-between items-center mb-5">
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

        <section className="flex justify-between items-center text-xs sm:text-lg lg:gap-x-5">
          <div className="flex justify-between items-center gap-x-2 text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out">
            <BiLibrary size="24" className="hidden" />
            <p className="hidden sm:block font-semibold">Your Library</p>
          </div>

          {/* Add Playlist Button with Dialog */}
          <Dialog>
            <DialogTrigger>
              <IoAdd
                size="24"
                className="text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out"
              />
            </DialogTrigger>
            <DialogContent className="bg-[#2a2a2a]">
              <DialogHeader>
                <DialogTitle>Create a New Playlist</DialogTitle>
                <DialogDescription>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Playlist Name */}
                    <div>
                      <label className="block text-white mb-2">Playlist Name</label>
                      <input
                        type="text"
                        placeholder="Enter Playlist Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full p-2 rounded bg-gray-800 text-white ${
                          errors.name ? "border-red-500" : "border-gray-600"
                        } border`}
                        required
                      />
                      {errors.name && (
                        <p className="text-red-500 mt-1">{errors.name}</p>
                      )}
                    </div>

                    {/* Playlist Description */}
                    <div>
                      <label className="block text-white mb-2">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
                      />
                    </div>

                    {/* Submit Button */}

                    <DialogClose asChild>
            <Button  type="submit"   className="w-full bg-green-500 p-2 rounded text-white hover:bg-green-600 transition">
            Create Playlist
            </Button>
          </DialogClose>
                   
                  </form>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </section>
      </section>

      {/* Album and Playlist Section */}
      <section className="overflow-scroll scrollbar-hide">
        <SidebarCards data={data} />
        <PlayListCards data={PlayListdata} />
      </section>
    </div>
  );
};

export default Sidebar;
