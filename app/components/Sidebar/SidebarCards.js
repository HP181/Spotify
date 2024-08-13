"use client"
import SpotifyContext from '@/app/Context/SpotifyContext';
import Image from 'next/image'
import { useRouter } from 'next/navigation';
import React, { useContext } from 'react'

const SidebarCards = ({data}) => {

    const ContextData = useContext(SpotifyContext);
    
    const handleClick = (index) => {
        // ContextData.setPlaylist(data);
        ContextData.SetSelectedAlbumIndex(index)
        router.push(`/${data[index]?.album?.type}/${data[index]?.album?.id}`)

    }


    const router = useRouter();
  return (
  <section className="flex flex-col items-start gap-4">
  {data?.map((item, index) => (
    <div
      key={index}
      className="flex items-center gap-4 hover:cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg w-full"
      onClick={() => handleClick(index)}
    //   onClick={() => router.push(`/${item?.album?.type}/${item?.album?.id}`)}
    >
      <Image
        src={item.album?.images[0].url}
        width="60"
        height="60"
        alt={`${item?.album?.artists[0]?.name} pic`}
        className="object-cover rounded-md w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
      />

      <div className="hidden lg:flex flex-col justify-center text-sm ">
        <p className=" text-white font-bold truncate">
          {item?.album?.name}
        </p>
        <p className="text-[#b3b3b3]">
          {item?.album?.type} &sdot; {item?.album?.artists[0]?.name}
        </p>
      </div>
    </div>
  ))}

</section>

  )
}

export default SidebarCards