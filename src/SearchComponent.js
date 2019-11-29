import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SongItem from "./SongItem";
import axios from "axios";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  drawerContents: {
    width: "95vw"
  },
  ul: {
    listStyle: "none",
    paddingInlineStart: 0
  }
}));

export default function SearchComponent(props) {
  const classes = useStyles();
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
      <div className={classes.drawerContents}>
        <Link to={props.returnUrl}>Back</Link>
        <SearchBar handleSubmit={handleSubmit} />
        <ul className={classes.ul}>{songItems}</ul>
      </div>
    </SwipeableDrawer>
  );
}
