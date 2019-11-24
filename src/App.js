import React from 'react';
import './App.css';
import YouTube from 'react-youtube';
import SearchBar from './SearchBar';
import SongItem from './SongItem';

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
      <SearchBar handleSubmit={(term) => console.log('submitted: ' + term)}/>
      <SongItem title='this is the title' channelTitle='channel title'
        thumbnail='https://i.ytimg.com/vi/TxfJbu-z_0Q/default.jpg'/>
    </div>
  );
}

export default App;
