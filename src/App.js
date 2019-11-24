import React from 'react';
import './App.css';
import YouTube from 'react-youtube';
import SearchComponent from './SearchComponent';
import PlayList from './Playlist';
import CreateRoom from './CreateRoom';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

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
    <Router>
      <Switch>
        <Route path="/">
          <CreateRoom />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
