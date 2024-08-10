"use client"
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
} from "@/components/ui/tooltip"
import Link from "next/link";
// import { useEffect, useState } from "react";
// import getAlbums from "@/actions/getAlbums";



const Sidebar = () => {
  
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(false);

  const pathname = usePathname();

  // const getDataa = async () => {
  //   const { message } = await getAlbums();
  //   setData(message);
  // };

  
  // useEffect(() => {
  //   const callgetData = async () => {
  //     setLoading(true);
  //     await getDataa();
  //     setLoading(false);
  //   };
  //   callgetData();
  // }, []);
  

  // useEffect(() => {
  //  console.log("aget", data);
  // }, [])
  
  return (
    <section className=" h-[87vh] flex flex-col justify-between items-center flex-1 p-1">
      
      <Link href="/" className={ pathname === '/' ? "flex justify-between items-center gap-x-3 text-xs text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg" : "flex justify-between items-center gap-x-3 text-xs text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"}>
      <MdHomeFilled size="24"/>
<p className="hidden sm:block font-semibold">Home</p>
      </Link>

      <Link href="/search" className={pathname === '/search' ? "flex justify-between items-center gap-x-3 text-xs text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg" : "flex justify-between items-center gap-x-3 text-xs text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out sm:text-lg"}>
      <IoIosSearch size="24"/>
      <p className="hidden sm:block font-semibold">Search</p>
      </Link>

      <div className='flex justify-between items-center gap-x-5 text-xs sm:text-lg'>
        <div className="flex justify-between items-center gap-x-2 text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out">

      <BiLibrary size="24" className="hidden"/>
      <p className="hidden sm:block font-semibold">Your Library</p>
        </div>
        <TooltipProvider>
  <Tooltip>
    <TooltipTrigger> <IoAdd size="24" className="text-[#b3b3b3] hover:text-white hover:cursor-pointer transition-all duration-150 ease-in-out"/></TooltipTrigger>
    <TooltipContent>
      <p className='hidden sm:block text-white font-semibold text-md'>Create Playlist</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
      </div>

   

     
    </section>
  )
}

export default Sidebar