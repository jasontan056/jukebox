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

const hiddenStyle = {
  display: "none"
};

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
    <div>
      <h3>Room ID: {roomId}</h3>
      <h3>Room Name: {roomName}</h3>
      <h3>CurrentSongId: {currentSongId}</h3>
      <h3>Playing: {playing ? "playing" : "paused"}</h3>
      <div style={searchRouteMatch ? hiddenStyle : null}>
        <PlayerControls
          roomId={roomId}
          playing={playing}
          disablePlayPause={disablePlayPause}
          disableNextButton={disableNextButton}
          disablePrevButton={disablePrevButton}
        />
        <Link to={`${routeMatch.url}/search`}>Search</Link>
        <PlayList songs={songs} currentSongId={currentSongId} />
      </div>
      <div style={searchRouteMatch ? null : hiddenStyle}>
        <Link to={`${routeMatch.url}`}>Back</Link>
        <SearchComponent onSongAdded={addSongToPlaylist} />
      </div>
    </div>
  );
}
