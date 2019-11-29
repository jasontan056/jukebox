import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SongItem from "./SongItem";
import axios from "axios";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link } from "react-router-dom";

const ulStyle = {
  listStyle: "none",
  paddingInlineStart: 0
};

export default function SearchComponent(props) {
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

  const toggleDrawer = opened => {};

  return (
    <SwipeableDrawer
      anchor="right"
      open={props.open}
      onClose={() => toggleDrawer(false)}
      onOpen={() => toggleDrawer(true)}
    >
      <Link to={props.returnUrl}>Back</Link>
      <SearchBar handleSubmit={handleSubmit} />
      <ul style={ulStyle}>{songItems}</ul>
    </SwipeableDrawer>
  );
}
