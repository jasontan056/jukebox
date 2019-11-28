import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useParams } from "react-router-dom";
import { onSongAdded, joinRoom, onRoomInfo } from './Socket';
import { List } from 'immutable';

export default function Player() {
    const { roomId } = useParams();
    const youtubePlayerOpts = {
        height: '390',
        width: '640',
        playerVars: { // https://developers.google.com/youtube/player_parameters
            autoplay: 1
        }
    };

    const [roomName, setRoomName] = useState('');
    const [songs, setSongs] = useState(List());
    const [currentSongId, setCurrentSongId] = useState(0);

    useEffect(() => {
        onRoomInfo((roomInfo) => {
            setRoomName(roomInfo.roomName);
            setCurrentSongId(roomInfo.currentSongId);
            setSongs(List(roomInfo.songs));
        });

        onSongAdded((song) => {
            setSongs(s => s.push(song));
        });

        joinRoom(roomId);
    }, [roomId, setRoomName, setSongs]);

    let videoId = null;
    if (setCurrentSongId) {
        const currentSong = songs.filter((song) => song.id === currentSongId)[0];
        videoId = currentSong ? currentSong.videoId : null;
    }

    let youtubePlayer;
    if (videoId) {
        youtubePlayer = (
            <YouTube
                videoId={videoId}
                opts={youtubePlayerOpts}
            />
        );
    } else {
        youtubePlayer = (
            <div>Add a song!</div>
        )
    }

    return (
        <div>
            <h3>Room ID: {roomId}</h3>
            <h3>Room Name: {roomName}</h3>
            <h3>CurrentSongId: {currentSongId}</h3>
            {youtubePlayer}
        </div>);
}