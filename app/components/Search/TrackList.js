// components/TrackList.js
"use client"
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';

export default function TrackList({ tracks }) {
  const [currentlyPlayingUri, setCurrentlyPlayingUri] = useState(null);
  const { data: session } = useSession();

  const playTrack = async (uri) => {
    try {
      // Make an API call to Spotify to play the track on the active device
      const response = await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        body: JSON.stringify({ uris: [uri] }),
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to play track');
      }

      // Set the currently playing track URI
      setCurrentlyPlayingUri(uri);
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };


  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {tracks?.map(track => (
        <div
          key={track.id}
          onClick={() => playTrack(track.uri)}
          className={`p-2 rounded-lg shadow hover:bg-[#2a2a2a] transition-shadow duration-300 cursor-pointer 
            ${currentlyPlayingUri === track.uri ? 'bg-[#2a2a2a]' : ''}`}
        >
          <div className="flex items-center">
            {track.album?.images[0]?.url && (
              <Image
                src={track.album.images[0].url}
                alt={track.name}
                width={100}
                height={100}
                className="rounded-lg"
              />
            )}
            <div className="ml-4">
              <p
                className={`text-xs md:text-base font-bold ${currentlyPlayingUri === track.uri ? 'text-[#18e58b]' : 'text-white'}`}
              >
                {track.name}
              </p>
              <p className="text-sm text-gray-500">
                {track.artists.map(artist => artist.name).join(', ')}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
