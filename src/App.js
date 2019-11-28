import React from "react";
import "./App.css";
import CreateRoom from "./CreateRoom";
import Client from "./Client";
import Player from "./Player";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/client/:roomId">
          <Client />
        </Route>
        <Route path="/player/:roomId">
          <Player />
        </Route>
        <Route path="/">
          <CreateRoom />
        </Route>
      </Switch>
    </Router>
  );
}
