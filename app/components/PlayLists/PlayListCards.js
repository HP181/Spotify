"use client"
import SpotifyContext from '@/app/Context/SpotifyContext';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect } from 'react'




const PlayListCards = ({data}) => {

    const ContextData = useContext(SpotifyContext);
    
    const handleClick = (item) => {
        ContextData.setPlayListData(item);
        ContextData.setSidebarPlayListId(item?.id)
        router.push(`/${item?.type}/${item?.id}`)

    }

    useEffect(() => {
      console.log("poll", data);
    })


    const router = useRouter();
  return (
  <section className="flex flex-col items-start gap-4">
  {data?.items?.map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-4 hover:cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg w-full"
      onClick={() => handleClick(item)}
    //   onClick={() => router.push(`/${item?.album?.type}/${item?.album?.id}`)}
    >
      {/* {item?.images[0]?.url ? (

      )} */}
      <Image
        src={item?.images == null ? '/SpotifyAlter.png' : item?.images[0]?.url}
        width="60"
        height="60"
        alt={`${item?.album?.artists[0]?.name} pic`}
        className="object-cover rounded-md w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
      />
{console.log("gcc", data)}
      <div className="hidden lg:flex flex-col justify-center text-sm ">
        <p className=" text-white font-bold truncate">
          {item?.name}
        </p>
        <p className="text-[#b3b3b3]">
          {item?.owner?.display_name}
        </p>
      </div>

  

    </div>
  ))}

</section>

  )
}

export default PlayListCards