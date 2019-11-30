import "./JukeboxLogo.css";

import React from "react";

export default function JukeboxLogo(props) {
  console.log("rendering logo with roomName: " + props.roomName);

  return (
    <div className={props.className}>
      <span className="headerText">{`${props.roomName} `}</span>
      <span className="headerText">Jukebox</span>
    </div>
  );
}
