import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useParams } from "react-router-dom";
import {
  onSongAdded,
  joinRoom,
  onRoomInfo,
  onCurrentSongIdChange,
  onPlayingChanged,
  sendPlayerState
} from "./Socket";
import { List } from "immutable";

export default function Player() {
  const { roomId } = useParams();
  const youtubePlayerOpts = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1,
      controls: 0
    }
  };

  const [roomName, setRoomName] = useState("");
  const [songs, setSongs] = useState(List());
  const [currentSongId, setCurrentSongId] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [youtubeTarget, setYoutubeTarget] = useState(null);

  useEffect(() => {
    onRoomInfo(roomInfo => {
      setRoomName(roomInfo.roomName);
      setCurrentSongId(roomInfo.currentSongId);
      setSongs(List(roomInfo.songs));
      setPlaying(roomInfo.playing);
    });
    onSongAdded(song => setSongs(s => s.push(song)));
    onPlayingChanged(playing => setPlaying(playing));
    onCurrentSongIdChange(currentSongId => setCurrentSongId(currentSongId));

    joinRoom(roomId);
  }, [roomId, setRoomName, setSongs]);

  let videoId = null;
  if (setCurrentSongId) {
    const currentSong = songs.find(song => song.id === currentSongId);
    videoId = currentSong ? currentSong.videoId : null;
  }

  const onReady = event => {
    setYoutubeTarget(event.target);
    playing ? event.target.playVideo() : event.target.pauseVideo();
  };

  let youtubePlayer;
  if (videoId) {
    youtubePlayer = (
      <YouTube
        videoId={videoId}
        opts={youtubePlayerOpts}
        onReady={onReady}
        onPlay={event => sendPlayerState(roomId, "play")}
        onPause={event => sendPlayerState(roomId, "pause")}
      />
    );
  } else {
    youtubePlayer = <div>Add a song!</div>;
  }

  if (youtubeTarget) {
    playing ? youtubeTarget.playVideo() : youtubeTarget.pauseVideo();
  }

  return (
    <div>
      <h3>Room ID: {roomId}</h3>
      <h3>Room Name: {roomName}</h3>
      <h3>CurrentSongId: {currentSongId}</h3>
      <h3>Playing: {playing ? "playing" : "paused"}</h3>
      {youtubePlayer}
    </div>
  );
}
