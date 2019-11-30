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
  sendCurrentSongId,
  onReconnect
} from "./Socket";
import { List } from "immutable";
import { useParams } from "react-router-dom";
import PlayerControls from "./PlayerControls";
import { Redirect, useRouteMatch } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SearchIcon from "@material-ui/icons/Search";
import IconButton from "@material-ui/core/IconButton";
import JukeboxLogo from "./JukeboxLogo";

const useStyles = makeStyles(theme => ({
  main: {
    boxSizing: "border-box",
    height: "100vh",
    positon: "fixed",
    display: "grid",
    gridTemplateRows: "min-content auto min-content"
  },
  playlist: {
    overflowX: "hidden",
    overflowY: "auto",
    paddingBottom: 50,
    background:
      "linear-gradient(90deg, rgba(253,29,29,1) 0%, rgba(252,176,69,1) 100%)"
  },
  header: {
    backgroundColor: "#af17bd",
    textAlign: "center",
    display: "flex"
  },
  searchButton: {
    paddingRight: 15
  },
  footer: {
    position: "fixed",
    bottom: 0,
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
  const [redirectBack, setRedirectBack] = useState(false);
  const [redirectToSearch, setRedirectToSearch] = useState(false);
  const routeMatch = useRouteMatch();
  const searchRouteMatch = useRouteMatch({
    path: `${routeMatch.path}/search`,
    strict: true,
    sensitive: true
  });

  // Subscribe to sockets.
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
  }, []);

  useEffect(() => {
    onReconnect(() => joinRoom(roomId));
    joinRoom(roomId);
  }, [roomId]);

  useEffect(() => {
    setSearchOpen(searchRouteMatch != null);

    setRedirectBack(false);
    setRedirectToSearch(false);
  }, [searchRouteMatch, setSearchOpen]);

  const addSongToPlaylist = song => addSong(roomId, song);
  const handleSongClicked = song => sendCurrentSongId(roomId, song.id);
  const onSearchClosed = () => setRedirectBack(true);
  const onSearchButtonClicked = () => setRedirectToSearch(true);

  const currentSongIndex = songs.findIndex(song => song.id === currentSongId);
  const disablePlayPause = !currentSongId;
  const disableNextButton =
    currentSongIndex === -1 || currentSongIndex === songs.count() - 1;
  const disablePrevButton = currentSongIndex < 1;
  return (
    <div>
      {redirectToSearch && <Redirect push to={`${routeMatch.url}/search`} />}
      {redirectBack && <Redirect to={routeMatch.url} />}
      <div className={classes.main}>
        <header className={classes.header}>
          <JukeboxLogo roomName={roomName} />
          <IconButton
            aria-label="search"
            className={classes.searchButton}
            onClick={onSearchButtonClicked}
          >
            <SearchIcon />
          </IconButton>
        </header>
        <div className={classes.playlist}>
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
        onDrawerClosed={onSearchClosed}
      />
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
