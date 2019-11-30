import React, { useState, useRef, useEffect } from "react";
import SearchBar from "./SearchBar";
import SongItem from "./SongItem";
import axios from "axios";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { List } from "immutable";

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
  const [songs, setSongs] = useState(List());
  const searchBarRef = useRef(null);

  let handleSubmit = async term => {
    // TODO: Should clear previous search terms here.
    // TODO: Show loading indicator?
    let results;
    try {
      results = await axios.get("/api/search", {
        params: { searchTerm: term }
      });
      setSongs(List(results.data));
    } catch (e) {
      console.log("Got error searching: " + e);
      return;
    }
  };

  const onDrawerClosed = () => {
    props.onDrawerClosed();
    setSongs(List());
  };

  const songItems = songs.map((song, index) => {
    let onSongAdded = () => {
      props.onSongAdded(song);
      onDrawerClosed();
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

  useEffect(() => {
    if (!props.open) {
      return;
    }

    // TODO: There has to be a less hacky way to do this.
    setTimeout(() => {
      searchBarRef.current && searchBarRef.current.focus();
    }, 100);
  }, [props.open, searchBarRef]);

  return (
    <SwipeableDrawer
      anchor="right"
      open={props.open}
      onClose={onDrawerClosed}
      onOpen={() => console.log("Drawer requesting to open")}
    >
      <div className={classes.drawerContents}>
        <div className={classes.searchBarGroup}>
          <IconButton aria-label="back" onClick={onDrawerClosed}>
            <ArrowBackIcon />
          </IconButton>
          <div className={classes.searchBar}>
            <SearchBar ref={searchBarRef} handleSubmit={handleSubmit} />
          </div>
        </div>
        <div className={classes.searchResults}>
          <ul className={classes.ul}>{songItems}</ul>
        </div>
      </div>
    </SwipeableDrawer>
  );
}
