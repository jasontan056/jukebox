import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import { List } from 'immutable';
import {
    useParams
} from "react-router-dom";

export default function Client(props) {
    const [songs, setSongs] = useState(List());
    const [currentSongId, setCurrentSongId] = useState(0);

    let { roomId } = useParams();

    useEffect(() => {
        // TODO: Fetch the songs in this room.
        // Remember to set currentSongId.
    }, [roomId]);

    let addSongToPlaylist = (song) => {
        // Send on socket to add song.
        setSongs(songs.push(song));
    };

    return (
        <div>
            <h3>Room ID: {roomId}</h3>
            <PlayList songs={songs} currentSongId={currentSongId} />
            <SearchComponent onSongAdded={addSongToPlaylist} />
        </div>
    );
}