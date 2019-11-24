import React, { useState, useEffect } from 'react';
import SongItem from './SongItem';
import axios from 'axios';

const ulStyle = {
    listStyle: 'none',
};

export default function PlayList(props) {
    const [songs, setSongs] = useState([]);
    const [currentSongId, setCurrentSongId] = useState(0);

    useEffect(() => {
        // TODO: Fetch the songs in this room.
        // Remember to set currentSongId.
    }, [props.roomId]);

    let songItems = songs.map((song, index) => {
        return (
            <li key={index}>
                <SongItem title={song.title}
                    channelTitle={song.channelTitle}
                    thumbnail={song.thumbnail}
                    highlighted={song.id === currentSongId} />
            </li>
        )
    });

    return (
        <ul style={ulStyle}>
            {songItems}
        </ul>
    );
}