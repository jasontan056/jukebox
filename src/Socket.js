import io from 'socket.io-client';

const socket = io()

export function joinRoom(roomId) {
    socket.emit('joinRoom', roomId);
}

export function onRoomInfo(cb) {
    socket.on('roomInfo', (roomInfo) => {
        console.log('received room info: ' + roomInfo);
        cb(roomInfo);
    });
}

export function addSong(roomId, song) {
    socket.emit('addSong', roomId, song);
}

let onSongCount = 0;
export function onSongAdded(cb) {
    socket.on('songAdded', (song) => {
        onSongCount++;
        console.log('onSongCount: ' + onSongCount);
        console.log('received song: ' + song);
        cb(song);
    });
}
