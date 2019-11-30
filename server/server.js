const express = require("express");
const path = require("path");
const axios = require("axios");
const querystring = require("querystring");
const Dao = require("./dao");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const handleSockets = require("./socketHandler");

app.use(express.static(path.join(__dirname, "../build")));
app.use(bodyParser.urlencoded({ extended: "true" })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());

const dbFile = path.join(__dirname, "../.data", "sqlite.db");
const dao = new Dao(dbFile);

handleSockets(io, dao);

app.get("/api/search", async (req, res) => {
  let searchTerm = req.query.searchTerm;

  let params = {
    q: searchTerm,
    part: "snippet",
    maxResults: 25,
    type: "video",
    videoCategoryId: 10,
    key: process.env.YOUTUBE_API_KEY
  };
  let response;
  try {
    response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search?" +
        querystring.stringify(params)
    );
  } catch (e) {
    return res.status(400).send("Error fetching search results.");
  }

  let results = response.data.items.map(item => {
    return {
      videoId: item.id.videoId,
      title: item.snippet.title,
      channelTitle: item.snippet.channelTitle,
      thumbnail: item.snippet.thumbnails.default.url
    };
  });
  return res.send(results);
});

app.get("/api/room/:roomId", (req, res) => {
  const roomId = req.params.roomId;
  if (!roomId) {
    return res.status(400).send("Missing Room ID");
  }

  dao
    .getRoomById(roomId)
    .then(room => {
      return res.send(room);
    })
    .catch(err => {
      return res.status(404).statusMessage("Cannot find room.");
    });
});

app.post("/api/room", (req, res) => {
  const roomName = req.body.roomName;
  console.log(roomName);

  dao
    .createRoom(roomName)
    .then(data => {
      console.log(data);
      res.send(data);
    })
    .catch(err => {
      res.status(500).statusMessage("Error creating room: " + err);
    });
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

process.on("uncaughtException", function(exception) {
  console.log("Got an uncaught exception: " + exception);
});

http.listen(process.env.PORT || 8080);
