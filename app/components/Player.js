"use client"
import { useContext, useEffect } from "react";
import { IoIosPlayCircle } from "react-icons/io";
import { ImNext2 } from "react-icons/im";
import SpotifyContext from "../Context/SpotifyContext";
import { useSession } from "next-auth/react";

const Player = () => {

    const { data: session } = useSession();
    const ContextData = useContext(SpotifyContext);
    
    useEffect(() => {
        console.log( "iri", ContextData?.SelectedSong);

    }, [ContextData])

    const setSong = async () => {
        const data = await fetch("https://api.spotify.com/v1/me/player/play",{
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify({
                context_uri: 'spotify:artist:1mBydYMVBECdDmMfE2sEUO',
                device_id : '3e1cc4701065655e0cd63836a1b4fc64cb0fc231'
                // position_ms: 0
              })
        })

        const response = await data?.json();
        console.log("data", data);
        console.log("response", response);
    }


    const SkipToNext = async () => {
        const data2 = await fetch("https://api.spotify.com/v1/me/player/next",{
            method: "POST",
            headers: {
                'Authorization': `Bearer ${session?.accessToken}`,
                "Content-Type": "application/json",
                
            },
            body: JSON.stringify({
                device_id: '3e1cc4701065655e0cd63836a1b4fc64cb0fc231',
                // position_ms: 0
              })
        })

        const response2 = await data2?.json();
        console.log("data2", data2);
        console.log("response2", response2);
    }

    return (
        <div className='flex justify-between items-center h-full px-10'>
            <div className="border-r-2 flex justify-center items-center">
                a
            </div>
            <div className=" flex justify-center items-center">
            <IoIosPlayCircle size="30" className='hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out' 
            onClick={() => setSong()}
            />
            </div>
            <div className="flex justify-center items-center">
            <ImNext2 size="30" className='hover:scale-110 hover:cursor-pointer transition-all duration-150 ease-in-out'
            onClick={() => SkipToNext()}
            />

            </div>
        </div>
  )
}

export default Player