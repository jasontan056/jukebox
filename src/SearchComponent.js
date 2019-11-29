import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SongItem from "./SongItem";
import axios from "axios";

const ulStyle = {
  listStyle: "none",
  paddingInlineStart: 0
};

export default function Search(props) {
  const [songs, setSongs] = useState([]);

  let handleSubmit = async term => {
    // TODO: Should clear previous search terms here.
    // TODO: Show loading indicator?
    let results;
    try {
      results = await axios.get("/api/search", {
        params: { searchTerm: term }
      });
      setSongs(results.data);
    } catch (e) {
      console.log("Got error searching: " + e);
      return;
    }
  };

  let songItems = songs.map((song, index) => {
    let onSongAdded = () => {
      props.onSongAdded(song);
    };
    return (
      <li key={index}>
        <SongItem
          title={song.title}
          channelTitle={song.channelTitle}
          thumbnail={song.thumbnail}
          showPlaylistAddButton="true"
          onPlaylistAddButtonClicked={onSongAdded}
        />
      </li>
    );
  });

  return (
    <div>
      <SearchBar handleSubmit={handleSubmit} />
      <ul style={ulStyle}>{songItems}</ul>
    </div>
  );
}
