import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import {joinRoom, onRoomInfo} from './Socket';
import { List } from 'immutable';
import axios from 'axios';
import {
    useParams
} from "react-router-dom";

export default function Client(props) {
    const [roomName, setRoomName] = useState('');
    const [songs, setSongs] = useState(List());
    const [currentSongId, setCurrentSongId] = useState(0);

    let { roomId } = useParams();

    useEffect(() => {
        onRoomInfo((roomInfo) => {
            // TODO: set songs and currentSongId from roomInfo
            console.log(roomInfo);
            setRoomName(roomInfo.name);
            setCurrentSongId(roomInfo.currentSongId);
        });
        joinRoom(roomId);
    }, [roomId, setRoomName]);


    let addSongToPlaylist = (song) => {
        // Send on socket to add song.
        setSongs(songs.push(song));
    };

    return (
        <div>
            <h3>Room ID: {roomId}</h3>
            <h3>Room Name: {roomName}</h3>
            <h3>CurrentSongId: {currentSongId}</h3>
            <PlayList songs={songs} currentSongId={currentSongId} />
            <SearchComponent onSongAdded={addSongToPlaylist} />
        </div>
    );
}