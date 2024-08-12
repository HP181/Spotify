// components/TrackList.js
"use client"
import React, { useContext } from 'react';
import SpotifyContext from '../Context/SpotifyContext';
import ConverToMinutesAndSecondsAndDigits from '@/lib/ConverToMinutesAndSecondsAndDigits';


const TrackList = () => {

    
  const ContextData = useContext(SpotifyContext);

  return (
    <div className="container mx-auto px-4 py-6">
    <div className="w-full bg-gray-900 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4">
        <table className="table-auto w-full">
          <thead>
            <tr className="text-left text-xs md:text-base">
              <th>#</th>
              <th>Title</th>
              <th className='hidden md:block'>Artist</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {ContextData?.Playlist?.tracks?.items?.map((track, index) => (
              <tr key={track.id} className="border-b border-gray-700 text-white text-xs md:text-base overflow-scroll" onClick={() => ContextData?.setSelectedSong(track?.uri)}>
                <td className="p-2">{index + 1}</td>
                <td className="p-2 text-green-400 truncate hover:underline hover:cursor-pointer">
                  <p>{track?.name}</p>
                </td>
                <td className="p-2 hidden md:block">{track?.artists[0]?.name}</td>
                <td className="p-2">{ConverToMinutesAndSecondsAndDigits(track?.duration_ms)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  );
};

export default TrackList;
