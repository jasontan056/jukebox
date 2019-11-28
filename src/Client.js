import React, { useState, useEffect } from 'react';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import {addSong, onSongAdded, joinRoom, onRoomInfo, sendPlayerState, onCurrentSongIdChange} from './Socket';
import { List } from 'immutable';
import {useParams} from "react-router-dom";
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';

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

    console.log('currentSongId : ' + currentSongId);
    const playPauseClicked = (playing) => {
        console.log('playpause clicked');
        const playerState = playing ? 'play' : 'pause';
        sendPlayerState(roomId, playerState);
    }

    const playPauseButton = playing ? (
        <IconButton aria-label="pause button"
            onClick={() =>playPauseClicked(false)}
            disabled={!currentSongId}>
            <PauseIcon />
        </IconButton>
    ) : (
        <IconButton aria-label="play button"
            onClick={() => playPauseClicked(true)}
            disabled={!currentSongId}>
            <PlayArrowIcon />
        </IconButton>
    ) ;

    let addSongToPlaylist = (song) => {
        // Send on socket to add song.
        addSong(roomId, song);
    };

    return (
        <div>
            <h3>Room ID: {roomId}</h3>
            <h3>Room Name: {roomName}</h3>
            <h3>CurrentSongId: {currentSongId}</h3>
            {playPauseButton}
            <PlayList songs={songs} currentSongId={currentSongId} />
            <SearchComponent onSongAdded={addSongToPlaylist} />
        </div>
    );
}