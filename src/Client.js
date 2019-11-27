import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import {addSong, onSongAdded, joinRoom, onRoomInfo} from './Socket';
import { List } from 'immutable';
import {
    useParams
} from "react-router-dom";

export default function Client(props) {
    const [roomName, setRoomName] = useState('');
    const [songs, setSongs] = useState(List());
    const [currentSongId, setCurrentSongId] = useState(0);
    const { roomId } = useParams();

    useEffect(() => {
        console.log('in userEffect!!!')
        onRoomInfo((roomInfo) => {
            // TODO: set songs and currentSongId from roomInfo
            console.log(roomInfo);
            setRoomName(roomInfo.name);
            setCurrentSongId(roomInfo.currentSongId);
        });
    
        onSongAdded((song) => {
            setSongs(s => s.push(song));
        });

        joinRoom(roomId);
    }, [roomId, setRoomName, setSongs]);


    let addSongToPlaylist = (song) => {
        // Send on socket to add song.
        addSong(roomId, song);
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