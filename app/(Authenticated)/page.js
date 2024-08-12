"use client"
import { useState, useContext, useEffect } from 'react';
import { useSession, signIn, signOut } from "next-auth/react";
import Gradients from '@/lib/Gradients';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import SpotifyContext from '../Context/SpotifyContext';
import Link from 'next/link';
import Image from 'next/image';
import convertToMinutesAndSeconds from '@/lib/convertToMinutesAndSeconds';
import TrackList from '../components/TrackList';

export default function Component() {
  const [Duration, setDuration] = useState("")
  const { data: session } = useSession();
  console.log("s", session);

  const ContextData = useContext(SpotifyContext);

  console.log("avb", ContextData?.Playlist);

  // Set the initial gradient state directly with a random selection
  const [gradient] = useState(() => {
    const randomIndex = Math.floor(Math.random() * Gradients.length);
    return Gradients[randomIndex];
  });

  useEffect(() => {
    const duration = convertToMinutesAndSeconds(ContextData?.Playlist?.tracks?.items[0]?.duration_ms)
    setDuration(duration)
  }, [ContextData])

  return (
    <div className=" h-[89vh] w-full rounded-lg "
    >
      <section className=' h-44 rounded-lg p-1 sticky top-0' style={{ background: gradient }}>
  
        <div className='flex justify-end items-center mt-1 mr-1 gap-x-5'>

            <Button className="hidden sm:block bg-white text-black font-bold px-5 py-2 rounded-3xl hover:scale-105 hover:bg-[#f0f0f0] hover:text-black duration-150 transition-all ease-in-out cursor-pointer">Explore Premium</Button>

            <Button className="hidden sm:block bg-[#202020] text-white font-bold px-5 py-2 rounded-3xl hover:scale-105 hover:bg-[#202020] hover:text-white duration-150 transition-all ease-in-out cursor-pointer" asChild>
              <Link href="https://www.spotify.com/ca-en/download/windows/" target='_blank'>Install App</Link>
            </Button>

          <div className='flex justify-center items-center bg-[#222222] rounded-full  h-8 w-8 hover:scale-105 duration-150 transition-all ease-in-out cursor-pointer' onClick={() => signOut()}>
            <div className='bg-[#19e68c] rounded-full  h-6 w-6 flex justify-center items-center'>


              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className='text-black font-bold'>{session?.user?.name.charAt(0)}</p>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{session?.user?.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

        </div>

        <div className='flex justify-start items-center gap-x-5 font-semibold'>
          <section>
          <Image src={ContextData?.Playlist?.images[0].url} height="1000" width="1000" alt='' className='h-32 w-32 rounded-lg'/>
          </section>
          <section className='flex flex-col justify-between items-start'>
          <span className='font-semibold text-sm'>{ContextData?.Playlist?.album_type}</span>
          <span className='font-semibold text-lg'>{ContextData?.Playlist?.name}</span>

          <section className='flex justify-start items-center text-sm'>
          <span className='font-semibold hover:underline hover:cursor-pointer '>{ContextData?.Playlist?.artists[0]?.name}</span>
          <span className='font-semibold'>&nbsp; &sdot; &nbsp;</span>
          <span className='font-semibold'>{ContextData?.Playlist?.release_date.split("-")[0]} &sdot; &nbsp;</span>
          <span className='font-semibold'>{Duration}</span>

          </section>
          </section>
        </div>
      </section>

      <div>
      {/* <h1 className="text-center text-2xl font-bold text-gray-800 mb-4">Spotify Track List</h1> */}

     
      {/* <TrackList /> */}
    <TrackList />

      
    </div>
      {/* Signed in as {session.user.email} <br /> */}
      {/* <button onClick={() => signOut()}>Sign out</button> */}
    </div>
  );
}
