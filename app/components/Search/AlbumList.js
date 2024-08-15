import Image from 'next/image';
import Link from 'next/link';

export default function AlbumList({ albums }) {
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {albums?.map(album => (
        <Link href={`/album/${album.id}`} key={album.id}>
          <div className="block bg-transparent hover:bg-[#2a2a2a] p-4 rounded-lg transition duration-300">
            <div className="mb-4">
              <Image
                src={album.images[0]?.url || '/default-album.png'} // Fallback image if no image available
                alt={album.name}
                width={300}
                height={300}
                className="rounded-lg object-cover"
              />
            </div>
            <p className="text-lg font-bold text-white truncate">{album.name}</p>
            <p className="text-sm text-gray-400">{album.release_date?.substring(0, 4)} • {album.artists.map(artist => artist.name).join(', ')}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
