"use client";
import SpotifyContext from "@/app/Context/SpotifyContext";
import ConverToMinutesAndSecondsAndDigits from "@/lib/ConverToMinutesAndSecondsAndDigits";
import { useSession } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";

const PlayListTracks = ({ id }) => {
  const [TracksData, setTracksData] = useState(null);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  
  const { playTrack, SelectedPlayListSong, setGlobalPlayListData } = useContext(SpotifyContext);
  const { data: session } = useSession();

  const GetTracks = async () => {
    const data = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Content-Type": "application/json",
      },
    });
    
    const response = await data?.json();
    setTracksData(response.items);
    setGlobalPlayListData(response?.items);
    console.log("getData res:", response);
  };

  const searchTracks = async () => {
    if (!query) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const searchData = await response.json();
      setSearchResults(searchData.tracks.items);
    } catch (error) {
      console.error('Error fetching tracks:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      searchTracks();
    }
  };

  const clearSearchResults = () => {
    setSearchResults([]);
    setQuery("");
  };

  const addTrackToPlaylist = async (trackUri) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uris: [trackUri],
        }),
      });

      if (response.ok) {
        console.log('Track added to playlist');
        // Refresh the playlist tracks
        GetTracks();
      } else {
        console.error('Failed to add track to playlist');
      }
    } catch (error) {
      console.error('Error adding track to playlist:', error);
    }
  };

  const removeTrackFromPlaylist = async (trackUri) => {
    try {
      const response = await fetch(`https://api.spotify.com/v1/playlists/${id}/tracks`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tracks: [{ uri: trackUri }],
        }),
      });

      if (response.ok) {
        console.log('Track removed from playlist');
        // Refresh the playlist tracks
        GetTracks();
      } else {
        console.error('Failed to remove track from playlist');
      }
    } catch (error) {
      console.error('Error removing track from playlist:', error);
    }
  };

  const isTrackInPlaylist = (trackUri) => {
    return TracksData?.some(track => track?.track?.uri === trackUri);
  };

  useEffect(() => {
    if (session) {
      GetTracks();
    }
  }, [session]);

  return (
    <div className="text-white p-6 rounded-lg">
      {/* Search Input and Buttons */}
      <div className="w-full mb-6 flex flex-col sm:flex-row sm:gap-4">
        <input
          type="text"
          placeholder="Search for songs or episodes"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full p-2 rounded-lg bg-gray-800 text-white placeholder-gray-500"
        />
        <div className="flex gap-4 mt-2 sm:mt-0">
          <button
            onClick={searchTracks}
            className="w-full sm:w-auto bg-[#19e68c] text-white p-2 rounded-lg hover:bg-green-600 transition"
          >
            Search
          </button>
          <button
            onClick={clearSearchResults}
            className="w-full sm:w-auto bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Display Search Results */}
      <section className="flex flex-col items-start gap-4 mb-6">
        {searchResults.map((track, index) => (
          <div
            key={index}
            className="flex items-center gap-4 hover:cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-lg w-full"
          >
            <img
              src={track.album.images == null ? '/SpotifyAlter.png' : track.album.images[0]?.url || '/SpotifyAlter.png'}
              alt={track.name}
              className="object-cover rounded-md w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16"
            />
            <div className="flex flex-col justify-center text-sm text-white">
              <p className="font-bold truncate">{track.name}</p>
              <p className="text-[#b3b3b3]">{track.artists.map(artist => artist.name).join(', ')}</p>
            </div>
            {!isTrackInPlaylist(track.uri) && (
              <button
                onClick={() => addTrackToPlaylist(track.uri)}
                className="ml-auto bg-[#19e68c] text-white p-2 rounded-lg hover:bg-green-600 transition"
              >
                Add to Playlist
              </button>
            )}
          </div>
        ))}
      </section>

      {/* Playlist Tracks */}
      <table className="w-full text-left">
        <thead>
          <tr className="text-xs uppercase text-gray-400 md:text-sm">
            <th className="w-10 p-2">#</th>
            <th className="p-2">Title</th>
            <th className="hidden md:table-cell p-2">Album</th>
            <th className="w-20 p-2 text-right">Duration</th>
            <th className="p-2 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {TracksData?.map((track, index) => (
           
            <tr
              key={index}
              className={`group transition-all ease-in-out ${SelectedPlayListSong === track?.track?.uri ? "text-[#1ed760]" : ""}`}
              onClick={() => playTrack(track?.track?.uri, index)}
            >
              {console.log("tcdd", track)}
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer group-hover:rounded-l-lg transition-all ease-in-out">
                {index + 1}
              </td>
              
              <td className="p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all ease-in-out">
                {track?.track?.name}
                 {console.log("sssong, track", SelectedPlayListSong)}
              </td>
              <td className="hidden md:table-cell p-2 group-hover:bg-gray-800 group-hover:cursor-pointer transition-all ease-in-out">
                {track?.track?.album?.name}
              </td>
              <td className="p-2 text-center group-hover:bg-gray-800 group-hover:cursor-pointer transition-all ease-in-out">
                {ConverToMinutesAndSecondsAndDigits(track?.track?.duration_ms)}
              </td>
              <td className="p-2 text-right flex justify-end items-center group-hover:bg-gray-800 group-hover:cursor-pointer group-hover:rounded-r-lg transition-all ease-in-out">
                <MdDelete 
                  size="35"
                  onClick={() => removeTrackFromPlaylist(track?.track?.uri)}
                  className=" text-white p-2 rounded-lg hover:bg-[#19e68c] transition"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlayListTracks;
