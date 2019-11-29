import React from "react";
import SongItem from "./SongItem";

const ulStyle = {
  listStyle: "none",
  paddingInlineStart: 0
};

export default function PlayList(props) {
  let songItems = props.songs.map((song, index) => {
    return (
      <li key={index}>
        <SongItem
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
