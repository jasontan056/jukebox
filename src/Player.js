import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";
import { useParams } from "react-router-dom";
import {
  onSongAdded,
  joinRoom,
  onRoomInfo,
  onCurrentSongIdChange,
  onPlayingChanged,
  sendPlayerState,
  onReconnect
} from "./Socket";
import { List } from "immutable";
import QRCode from "qrcode.react";
import JukeboxLogo from "./JukeboxLogo";
import { makeStyles } from "@material-ui/core/styles";
import PlayList from "./Playlist";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme => ({
  root: {},
  body: {
    display: "flex"
  },
  player: {
    textAlign: "center",
    background:
      "linear-gradient(90deg, rgba(253,29,29,1) 0%, rgba(252,176,69,1) 100%)"
  },
  playlist: {
    flexGrow: 1,
    height: "100vh",
    overflowX: "hidden",
    overflowY: "auto",
    background:
      "linear-gradient(90deg, rgba(252,176,69,1) 0%, rgba(253,29,29,1) 100%)"
  },
  header: {
    backgroundColor: "#af17bd",
    textAlign: "center",
    display: "flex"
  }
}));

export default function Player() {
  const classes = useStyles();
  const { roomId } = useParams();
  const youtubePlayerOpts = {
    height: "576",
    width: "1024",
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
  const clientUrl = `https://${window.location.host}/client/${roomId}`;

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

  let videoId = null;
  if (currentSongId) {
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
        onEnd={event => sendPlayerState(roomId, "next")}
      />
    );
  } else {
    youtubePlayer = (
      <Typography variant="h4" noWrap>
        Scan to add a song!
      </Typography>
    );
  }

  if (youtubeTarget) {
    playing ? youtubeTarget.playVideo() : youtubeTarget.pauseVideo();
  }

  return (
    <div className={classes.root}>
      <header className={classes.header}>
        <JukeboxLogo roomName={roomName} />
      </header>
      <div className={classes.body}>
        <div className={classes.player}>
          {youtubePlayer}
          <QRCode value={clientUrl} />
        </div>
        <div className={classes.playlist}>
          <PlayList songs={songs} currentSongId={currentSongId} />
        </div>
      </div>
    </div>
  );
}
