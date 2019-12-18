import React from "react";
import SongItem from "./SongItem";

const ulStyle = {
  listStyle: "none",
  margin: 0,
  paddingInlineStart: 0
};

const clickableSongItem = {
  cursor: "pointer"
};

const nonClickableSongItem = {
  cursor: "default"
};

export default function PlayList(props) {
  let songItems = props.songs.map((song, index) => {
    return (
      <li key={index}>
        <SongItem
          style={props.clickable ? clickableSongItem : nonClickableSongItem}
          onClick={() => props.onSongClicked && props.onSongClicked(song)}
          title={song.title}
          channelTitle={song.channelTitle}
          thumbnail={song.thumbnail}
          highlighted={song.id === props.currentSongId}
        />
      </li>
    );
  });

  return <ul style={ulStyle}>{songItems}</ul>;
}
