import React, { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";
import PlayList from "./Playlist";
import {
  addSong,
  onSongAdded,
  joinRoom,
  onRoomInfo,
  onCurrentSongIdChange,
  onPlayingChanged,
  sendCurrentSongId
} from "./Socket";
import { List } from "immutable";
import { useParams } from "react-router-dom";
import PlayerControls from "./PlayerControls";
import { useRouteMatch, Link, Redirect } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import "./Client.css";

const useStyles = makeStyles(theme => ({
  root: {
    boxSizing: "border-box",
    height: "100vh",
    display: "grid",
    gridTemplateRows: "min-content auto min-content"
  },
  main: {
    overflow: "auto",
    background:
      "linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 0%, rgba(252,176,69,1) 100%)"
  },
  header: {
    backgroundColor: "#af17bd",
    textAlign: "center"
  },
  footer: {
    height: "50px",
    width: "100%",
    backgroundColor: "#af17bd",
    textAlign: "center"
  },
  hidden: {
    display: "none"
  }
}));

export default function Client(props) {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [songs, setSongs] = useState(List());
  const [currentSongId, setCurrentSongId] = useState(null);
  const { roomId } = useParams();
  const [playing, setPlaying] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const routeMatch = useRouteMatch();
  const searchRouteMatch = useRouteMatch({
    path: `${routeMatch.path}/search`,
    strict: true,
    sensitive: true
  });

  useEffect(() => {
    onRoomInfo(roomInfo => {
      setRoomName(roomInfo.roomName);
      setCurrentSongId(roomInfo.currentSongId);
      setSongs(List(roomInfo.songs));
      setPlaying(roomInfo.playing);
    });

    onSongAdded(song => {
      setSongs(s => s.push(song));
    });
    onCurrentSongIdChange(id => setCurrentSongId(id));
    onPlayingChanged(playing => setPlaying(playing));

    joinRoom(roomId);
  }, [roomId, setRoomName, setSongs]);

  useEffect(() => {
    setSearchOpen(searchRouteMatch != null);
  }, [searchRouteMatch, setSearchOpen]);

  const addSongToPlaylist = song => {
    addSong(roomId, song);
  };
  const handleSongClicked = song => {
    sendCurrentSongId(roomId, song.id);
  };

  const currentSongIndex = songs.findIndex(song => song.id === currentSongId);
  const disablePlayPause = !currentSongId;
  const disableNextButton =
    currentSongIndex === -1 || currentSongIndex === songs.count() - 1;
  const disablePrevButton = currentSongIndex < 1;
  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <h1 className="headerText">{roomName} Jukebox</h1>
      </header>
      <div className={classes.main}>
        <div>
          <Link to={`${routeMatch.url}/search`}>Search</Link>
          <PlayList
            songs={songs}
            currentSongId={currentSongId}
            onSongClicked={handleSongClicked}
          />
        </div>
      </div>
      <SearchComponent
        open={searchOpen}
        returnUrl={routeMatch.url}
        onSongAdded={addSongToPlaylist}
      />
      {!searchOpen ? <Redirect to={routeMatch.url} /> : null}
      <footer className={classes.footer}>
        <PlayerControls
          roomId={roomId}
          playing={playing}
          disablePlayPause={disablePlayPause}
          disableNextButton={disableNextButton}
          disablePrevButton={disablePrevButton}
        />
      </footer>
    </div>
  );
}
