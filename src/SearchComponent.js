import React, { useState } from "react";
import SearchBar from "./SearchBar";
import SongItem from "./SongItem";
import axios from "axios";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

const useStyles = makeStyles(theme => ({
  drawerContents: {
    width: "95vw",
    height: "100%",
    display: "grid",
    gridTemplateRows: "min-content auto",
    background:
      "linear-gradient(90deg, rgba(105,252,69,1) 0%, rgba(69,252,73,0.30996148459383754) 100%)"
  },
  searchBarGroup: {
    display: "flex"
  },
  backButton: {
    verticalAlign: "middle",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingRight: 5
  },
  searchBar: {
    flexGrow: 1,
    paddingRight: 12
  },
  searchResults: {
    width: "inherit",
    overflow: "auto"
  },
  ul: {
    listStyle: "none",
    paddingInlineStart: 0,
    margin: 0
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

  return (
    <SwipeableDrawer
      anchor="right"
      open={props.open}
      onClose={props.onDrawerClosed}
      onOpen={() => console.log("Search drawer opened.")}
    >
      <div className={classes.drawerContents}>
        <div className={classes.searchBarGroup}>
          <IconButton aria-label="back" onClick={props.onDrawerClosed}>
            <ArrowBackIcon />
          </IconButton>
          <div className={classes.searchBar}>
            <SearchBar handleSubmit={handleSubmit} />
          </div>
        </div>
        <div className={classes.searchResults}>
          <ul className={classes.ul}>{songItems}</ul>
        </div>
      </div>
    </SwipeableDrawer>
  );
}
