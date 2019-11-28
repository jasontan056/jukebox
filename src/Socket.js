import io from "socket.io-client";

const socket = io();

export function joinRoom(roomId) {
  socket.emit("joinRoom", roomId);
}

export function onRoomInfo(cb) {
  socket.on("roomInfo", roomInfo => {
    console.log("received room info: " + roomInfo);
    cb(roomInfo);
  });
}

export function addSong(roomId, song) {
  socket.emit("addSong", roomId, song);
}

let onSongCount = 0;
export function onSongAdded(cb) {
  socket.on("songAdded", song => {
    onSongCount++;
    console.log("onSongCount: " + onSongCount);
    console.log("received song: " + song);
    cb(song);
  });
}

// state can be 'play', 'pause', 'next', 'prev'
export function sendPlayerState(roomId, state) {
  console.log("about to send player state: " + state);
  socket.emit("playerState", roomId, state);
}

export function onPlayingChanged(cb) {
  socket.on("playing", playing => cb(playing));
}

export function onCurrentSongIdChange(cb) {
  socket.on("currentSongId", currentSongId => cb(currentSongId));
}

socket.on("connect", () => console.log("socket connected"));
socket.on("disconnect", reason =>
  console.log("socket disconnected: " + reason)
);
