"use client"
import React, { useState } from "react";
import SpotifyContext from "./SpotifyContext";

const SpotifyState = (props) => {

  const [Token, setToken] = useState("");
  const [UserName, setUserName] = useState("");
  const [GlobalSelectedItem, SetGlobalSelectedItem] = useState([]);
  const [SelectedAlbumIndex, SetSelectedAlbumIndex] = useState(null);
  const [SelectedSong, setSelectedSong] = useState(null);
  
  // const [PlaylistId, setPlaylistId] = useState("");
    // const [PlaylistTracks, setPlaylistTracks] = useState([]);
    // const [PlaylistTracksId, setPlaylistTracksId] = useState("");
    // const [PlaylistTracksName, setPlaylistTracksName] = useState("");
    // const [PlaylistTracksArtist, setPlaylistTracksArtist] = useState("");
    // const [PlaylistTracksAlbum, setPlaylistTracksAlbum] = useState("");
    // const [PlaylistTracksDuration, setPlaylistTracksDuration] = useState("");

  return (
    <SpotifyContext.Provider value={{ Token, setToken, GlobalSelectedItem, SetGlobalSelectedItem, UserName, setUserName, SelectedSong, setSelectedSong, SetSelectedAlbumIndex, SelectedAlbumIndex }}>
      {props.children}
    </SpotifyContext.Provider>
  );
};

export default SpotifyState;