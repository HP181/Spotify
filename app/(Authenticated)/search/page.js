"use client"
import { useState } from 'react';
import { useSession } from "next-auth/react";

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TrackList from '@/app/components/Search/TrackList';
import AlbumList from '@/app/components/Search/AlbumList';
import ArtistList from '@/app/components/Search/ArtistList';

export default function SearchComponent() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const { data: session } = useSession();

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track,album,artist&limit=20`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("searched results", data);

      // Sorting by title (name)
    

      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching search data:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search for songs, albums, or artists..."
          className="mr-2 w-full"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <div className="mt-4">
        {searchResults?.tracks?.items && (
          <div>
            <h2 className="text-xl font-bold">Tracks</h2>
            <TrackList tracks={searchResults.tracks.items} />
          </div>
        )}

        {searchResults?.albums?.items && (
          <div className='mt-20'>
            <h2 className="text-xl font-bold">Albums</h2>
            <AlbumList albums={searchResults.albums.items} />
          </div>
        )}

        {searchResults?.artists?.items && (
          <div className='mt-20'>
            <h2 className="text-xl font-bold">Artists</h2>
            <ArtistList artists={searchResults.artists.items} />
          </div>
        )}
      </div>
    </div>
  );
}
