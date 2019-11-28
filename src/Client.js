import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import {addSong, onSongAdded, joinRoom, onRoomInfo, onCurrentSongIdChange} from './Socket';
import { List } from 'immutable';
import {useParams} from "react-router-dom";
import PlayerControls from './PlayerControls';

export default function Client(props) {
    const [roomName, setRoomName] = useState('');
    const [songs, setSongs] = useState(List());
    const [currentSongId, setCurrentSongId] = useState(null);
    const { roomId } = useParams();
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        console.log('in userEffect!!!')
        onRoomInfo((roomInfo) => {
            // TODO: set songs and currentSongId from roomInfo
            console.log(roomInfo);
            setRoomName(roomInfo.roomName);
            setCurrentSongId(roomInfo.currentSongId);
            setSongs(List(roomInfo.songs));
            setPlaying(roomInfo.playing);
        });
    
        onSongAdded((song) => {
            setSongs(s => s.push(song));
        });

        onCurrentSongIdChange((id) => setCurrentSongId(id));

        joinRoom(roomId);
    }, [roomId, setRoomName, setSongs]);

    let addSongToPlaylist = (song) => {
        // Send on socket to add song.
        addSong(roomId, song);
    };

    const currentSongIndex =
        songs.findIndex((song) => song.id === currentSongId);
    const disablePlayPause = !currentSongId;
    const disableNextButton = currentSongIndex === -1 || currentSongIndex === songs.count() - 1;
    const disablePrevButton = currentSongIndex < 1;
    return (
        <div>
            <h3>Room ID: {roomId}</h3>
            <h3>Room Name: {roomName}</h3>
            <h3>CurrentSongId: {currentSongId}</h3>
            <PlayerControls roomId={roomId}
                playing={playing}
                disablePlayPause={disablePlayPause}
                disableNextButton={disableNextButton}
                disablePrevButton={disablePrevButton}/>
            <PlayList songs={songs} currentSongId={currentSongId} />
            <SearchComponent onSongAdded={addSongToPlaylist} />
        </div>
    );
}