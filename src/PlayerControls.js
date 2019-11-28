import React from "react";
import IconButton from "@material-ui/core/IconButton";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { sendPlayerState } from "./Socket";

export default function PlayerControls(props) {
  const playerStateButtonClicked = state => {
    sendPlayerState(props.roomId, state);
  };
  const playPauseButton = props.playing ? (
    <IconButton
      aria-label="pause button"
      onClick={() => playerStateButtonClicked("pause")}
      disabled={props.disablePlayPause}
    >
      <PauseIcon />
    </IconButton>
  ) : (
    <IconButton
      aria-label="play button"
      onClick={() => playerStateButtonClicked("play")}
      disabled={props.disablePlayPause}
    >
      <PlayArrowIcon />
    </IconButton>
  );
  const nextButton = (
    <IconButton
      aria-label="skip next button"
      onClick={() => playerStateButtonClicked("next")}
      disabled={props.disableNextButton}
    >
      <SkipNextIcon />
    </IconButton>
  );
  const prevButton = (
    <IconButton
      aria-label="skip previous button"
      onClick={() => playerStateButtonClicked("prev")}
      disabled={props.disablePrevButton}
    >
      <SkipPreviousIcon />
    </IconButton>
  );

  return (
    <div>
      {prevButton}
      {playPauseButton}
      {nextButton}
    </div>
  );
}
