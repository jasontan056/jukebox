const express = require('express');
const path = require('path');
const axios = require('axios');
const querystring = require('querystring');
require('dotenv').config();
const app = express();
app.use(express.static(path.join(__dirname, 'build')));

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

  let results = response.data.items.map(item => { return {
    id: item.id.videoId,
    title: item.snippet.title,
    channelTitle: item.snippet.channelTitle,
    thumbnail: item.snippet.thumbnails.default}});
  return res.send(results);
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || 8080);