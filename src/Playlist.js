import React from "react";
import SongItem from "./SongItem";

const ulStyle = {
  listStyle: "none",
  margin: 0,
  paddingInlineStart: 0
};

const songItemStyle = {
  cursor: "pointer"
};

export default function PlayList(props) {
  let songItems = props.songs.map((song, index) => {
    return (
      <li key={index}>
        <SongItem
          style={songItemStyle}
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
