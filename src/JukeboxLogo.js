import "./JukeboxLogo.css";

import React from "react";

export default function JukeboxLogo(props) {
  return <h1 className="headerText">{`${props.roomName} Jukebox`}</h1>;
}
