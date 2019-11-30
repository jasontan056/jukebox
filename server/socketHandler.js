module.exports = function handleSockets(io, dao) {
  const roomToSockets = {};

  const emitToSocketsInRoom = (roomId, message, ...args) => {
    roomToSockets[roomId].forEach(socket => socket.emit(message, ...args));
  };

  io.on("connection", socket => {
    console.log("a user connected");
    let currentRoom;

    socket.on("disconnect", function() {
      console.log("user disconnected");

      if (currentRoom) {
        if (!(currentRoom in roomToSockets)) {
          return;
        }

        console.log("before remove: " + roomToSockets[currentRoom]);
        roomToSockets[currentRoom] = roomToSockets[currentRoom].filter(s => {
          return s !== socket;
        });

        console.log("current room: " + currentRoom);
        console.log("members in room: " + roomToSockets[currentRoom].length);
      }
    });

    socket.on("currentSongId", async (roomId, currentSongId) => {
      try {
        await dao.updateRoomCurrentSongId(roomId, currentSongId);
        emitToSocketsInRoom(roomId, "currentSongId", currentSongId);
      } catch (e) {
        console.log("Couldn't update current song id: " + e);
      }
    });

    socket.on("addSong", async (roomId, song) => {
      console.log("server handling addSong");
      console.log(roomId);
      console.log(song);

      // If this is the first song you also have to
      // update current song in room to this songId.
      try {
        const songData = await dao.addSong(song, roomId);
        song.id = songData.lastId;
        emitToSocketsInRoom(roomId, "songAdded", song);

        const songs = await dao.getSongsByRoomId(roomId);
        // If this was the first song, update current song in room.
        if (songs.length === 1) {
          await dao.updateRoomCurrentSongId(roomId, song.id);

          emitToSocketsInRoom(roomId, "currentSongId", song.id);
        }
      } catch (err) {
        console.log("Error adding song: " + err);
      }
    });

    // State can be 'play', 'pause', 'next', 'prev'
    socket.on("playerState", async (roomId, state) => {
      console.log("handling player action: " + state);
      try {
        const room = await dao.getRoomById(roomId);
        // Shouldn't be able to change player state if there is no
        // current song.
        if (!room.currentSongId) {
          throw new Error("No current song.");
        }

        if (state === "play" || state === "pause") {
          const playing = state === "play";
          dao.updateRoomPlaying(roomId, playing);
          emitToSocketsInRoom(roomId, "playing", playing);
          return;
        }

        const songs = await dao.getSongsByRoomId(roomId);
        const currentSongIndex = songs.findIndex(
          song => song.id === room.currentSongId
        );
        if (currentSongIndex < 0) {
          throw new Error("current song doesn't exist in song table");
        }
        let updatedSongId;
        if (state === "next") {
          if (currentSongIndex + 1 === songs.length) {
            throw new Error("No next song.");
          }
          updatedSongId = songs[currentSongIndex + 1].id;
        } else if (state === "prev") {
          if (currentSongIndex === 0) {
            throw new Error("No previous song.");
          }
          updatedSongId = songs[currentSongIndex - 1].id;
        }

        dao.updateRoomCurrentSongId(roomId, updatedSongId);
        emitToSocketsInRoom(roomId, "currentSongId", updatedSongId);
      } catch (err) {
        console.log("Error handling player state: " + err);
        return;
      }
    });

    socket.on("joinRoom", roomId => {
      console.log(`user joined ${roomId}`);
      currentRoom = roomId;
      if (!(currentRoom in roomToSockets)) {
        roomToSockets[currentRoom] = [];
      }

      roomToSockets[currentRoom].push(socket);

      console.log("current room: " + currentRoom);
      console.log("members in room: " + roomToSockets[currentRoom].length);

      Promise.all([dao.getRoomById(roomId), dao.getSongsByRoomId(roomId)])
        .then(([room, songs]) => {
          console.log(room);

          const roomInfo = {
            roomName: room.name,
            currentSongId: room.currentSongId,
            songs: songs,
            playing: room.playing
          };
          socket.emit("roomInfo", roomInfo);
        })
        .catch(err => {
          console.log("Got error getting room info: " + err);
        });
    });
  });
};
