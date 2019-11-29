import React, { useState, useEffect } from "react";
import SearchComponent from "./SearchComponent";
import PlayList from "./Playlist";
import {
  addSong,
  onSongAdded,
  joinRoom,
  onRoomInfo,
  onCurrentSongIdChange,
  onPlayingChanged
} from "./Socket";
import { List } from "immutable";
import { useParams } from "react-router-dom";
import PlayerControls from "./PlayerControls";
import { useRouteMatch, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    boxSizing: "border-box",
    height: "100vh",
    display: "grid",
    gridTemplateRows: "min-content auto min-content"
  },
  main: {
    overflow: "auto"
  },
  footer: {
    height: "50px",
    width: "100%",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.grey[800]
        : theme.palette.grey[200]
  },
  hidden: {
    display: "none"
  }
}));

export default function Client(props) {
  const [roomName, setRoomName] = useState("");
  const [songs, setSongs] = useState(List());
  const [currentSongId, setCurrentSongId] = useState(null);
  const { roomId } = useParams();
  const [playing, setPlaying] = useState(false);
  const routeMatch = useRouteMatch();
  const searchRouteMatch = useRouteMatch({
    path: `${routeMatch.path}/search`,
    strict: true,
    sensitive: true
  });
  const classes = useStyles();

  useEffect(() => {
    console.log("in userEffect!!!");
    onRoomInfo(roomInfo => {
      // TODO: set songs and currentSongId from roomInfo
      console.log(roomInfo);
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

  let addSongToPlaylist = song => {
    // Send on socket to add song.
    addSong(roomId, song);
  };

  const currentSongIndex = songs.findIndex(song => song.id === currentSongId);
  const disablePlayPause = !currentSongId;
  const disableNextButton =
    currentSongIndex === -1 || currentSongIndex === songs.count() - 1;
  const disablePrevButton = currentSongIndex < 1;
  return (
    <div className={classes.root}>
      <h3>Room Name: {roomName}</h3>
      <div className={classes.main}>
        <div className={searchRouteMatch ? classes.hidden : null}>
          <Link to={`${routeMatch.url}/search`}>Search</Link>
          <PlayList songs={songs} currentSongId={currentSongId} />
        </div>
        <div className={searchRouteMatch ? null : classes.hidden}>
          <Link to={`${routeMatch.url}`}>Back</Link>
          <SearchComponent onSongAdded={addSongToPlaylist} />
        </div>
      </div>
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
