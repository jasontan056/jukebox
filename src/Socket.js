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
