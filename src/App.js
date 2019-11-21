import React from 'react';
import './App.css';
import YouTube from 'react-youtube';

function App() {
  const youtubePlayerOpts = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

  return (
    <div className="App">
      <YouTube
        videoId="2g811Eo7K8U"
        opts={youtubePlayerOpts}
      />
    </div>
  );
}

export default App;
