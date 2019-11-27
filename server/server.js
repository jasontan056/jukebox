const express = require('express');
const path = require('path');
const axios = require('axios');
const querystring = require('querystring');
const Dao = require('./dao');
require('dotenv').config();
const bodyParser = require('body-parser');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(path.join(__dirname, '../build')));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

const dbFile = './.data/sqlite.db'
const dao = new Dao(dbFile)

const roomToSockets = {};
io.on('connection', (socket) => {
  console.log('a user connected');
  let currentRoom;

  socket.on('disconnect', function () {
    console.log('user disconnected');
    console.log(currentRoom);
    console.log(roomToSockets);
    if (currentRoom) {
      if (!(currentRoom in roomToSockets)) {
        return;
      }

      console.log('before remove: ' + roomToSockets[currentRoom]);
      roomToSockets[currentRoom] = roomToSockets[currentRoom].filter((s) => {
        return s !== socket;
      });

      console.log('after remove: ' + roomToSockets[currentRoom]);
    }
  });

  socket.on('addSong', (roomId, song) => {
    console.log('server handling addSong');
    console.log(roomId);
    console.log(song);
    console.log('blah');

    dao.addSong(song, roomId)
      .then((data) => {
        console.log('successfully added song: ' + data.id);
        song.id = data.id;
        
        io.emit('songAdded', song);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  socket.on('joinRoom', roomId => {
    console.log(`user joined ${roomId}`);
    currentRoom = roomId;
    if (!roomToSockets[currentRoom]) {
      roomToSockets[currentRoom] = [];
    }

    roomToSockets[currentRoom].push(socket);

    // TODO: send over playlist and room info
    Promise.all([dao.getRoomById(roomId)])
      .then(([room]) => {
        console.log(room);

        // TODO: Fetch songs and add to room Info as well.
        const roomInfo = room;
        io.emit('roomInfo', roomInfo);
      })
      .catch((err) => {
        console.log('Got error getting room info: ' + err);
      });
    });
  });

app.get('/api/search', async (req, res) => {
  let searchTerm = req.query.searchTerm;

  let params = {
    q: searchTerm,
    part: 'snippet',
    maxResults: 25,
    type: 'video',
    videoCategoryId: 10,
    key: process.env.YOUTUBE_API_KEY,
  }
  let response;
  try {
    response =
      await axios.get('https://www.googleapis.com/youtube/v3/search?' + querystring.stringify(params));
  } catch (e) {
    return res.status(400).send("Error fetching search results.");
  }

  let results = response.data.items.map(item => {
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url
    }
  });
  return res.send(results);
});

app.get('/api/room/:roomId', (req, res) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    return res.status(400).send('Missing Room ID');
  }

  dao.getRoomById(roomId)
    .then((room) => {
      return res.send(room);
    })
    .catch((err) => {
      return res.status(404).statusMessage('Cannot find room.');
    });
});

app.post('/api/room', (req, res) => {
  const roomName = req.body.roomName;
  console.log(roomName);

  dao.createRoom(roomName)
    .then((data) => {
      console.log(data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).statusMessage('Error creating room: ' + err);
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

http.listen(process.env.PORT || 8080);
