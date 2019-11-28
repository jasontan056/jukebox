module.exports = function handleSockets(io, dao) {
  const roomToSockets = {};

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

    socket.on("addSong", async (roomId, song) => {
      console.log("server handling addSong");
      console.log(roomId);
      console.log(song);
      console.log("blah");

      // If this is the first song you also have to
      // update current song in room to this songId.
      try {
        const songData = await dao.addSong(song, roomId);
        song.id = songData.lastId;
        io.emit("songAdded", song);

        const songs = await dao.getSongsByRoomId(roomId);
        // If this was the first song, update current song in room.
        if (songs.length === 1) {
          await dao.updateRoomCurrentSongId(roomId, song.id);

          io.emit("currentSongId", song.id);
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
          // Set state to play only if there is a current song to play.
          dao.updateRoomPlaying(roomId, state === "play");
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
        io.emit("currentSongId", updatedSongId);
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

      // TODO: send over playlist and room info
      Promise.all([dao.getRoomById(roomId), dao.getSongsByRoomId(roomId)])
        .then(([room, songs]) => {
          console.log(room);
          console.log(songs);

          const roomInfo = {
            roomName: room.name,
            currentSongId: room.currentSongId,
            songs: songs,
            playing: room.playing
          };
          io.emit("roomInfo", roomInfo);
        })
        .catch(err => {
          console.log("Got error getting room info: " + err);
        });
    });
  });
};
