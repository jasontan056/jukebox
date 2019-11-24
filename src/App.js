import React from 'react';
import './App.css';
import YouTube from 'react-youtube';
import SearchComponent from './SearchComponent';

function App() {
  const youtubePlayerOpts = {
    height: '390',
    width: '640',
    playerVars: { // https://developers.google.com/youtube/player_parameters
      autoplay: 1
    }
  };

/*  
      <YouTube
        videoId="2g811Eo7K8U"
        opts={youtubePlayerOpts}
      />*/
  return (
    <div className="App">
      <SearchComponent onSongAdded={(song) => console.log(song)}/>
    </div>
  );
}

export default App;
