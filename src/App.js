import React from 'react';
import './App.css';
import YouTube from 'react-youtube';
import SearchBar from './SearchBar';

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
      <SearchBar handleSubmit={(term) => console.log('submitted: ' + term)}/>
      <YouTube
        videoId="2g811Eo7K8U"
        opts={youtubePlayerOpts}
      />
    </div>
  );
}

export default App;
