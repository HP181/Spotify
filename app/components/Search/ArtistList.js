import Image from 'next/image';
import Link from 'next/link';

export default function ArtistList({ artists }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {artists?.map(artist => (
          <div className="flex flex-col items-center text-center hover:cursor-pointer p-4 rounded-lg hover:bg-[#2a2a2a] transition duration-300" key={artist?.id}>
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden mb-4">
              <Image
                src={artist.images[0]?.url || '/default-artist.png'} // Fallback image if no image available
                alt={artist.name}
                width={200}
                height={200}
                className="object-cover"
              />
            </div>
            <p className="text-lg font-bold text-white">{artist.name}</p>
            <p className="text-sm text-gray-500">Artist</p>
          </div>
      ))}
    </div>
  );
}
