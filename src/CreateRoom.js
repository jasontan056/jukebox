import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import { Redirect } from "react-router-dom";

const useStyles = makeStyles(theme => ({
  container: {},
  textField: {}
}));

export default function CreateRoom() {
  const classes = useStyles();
  const [roomName, setRoomName] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [navigateToClient, setNavigateToClient] = useState(false);

  let handleSubmit = event => {
    event.preventDefault();
    axios
      .post("/api/room", {
        roomName: roomName
      })
      .then(response => {
        setRoomId(response.data.lastId);
        setNavigateToClient(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (navigateToClient) {
    return <Redirect push to={`/player/${roomId}`} />;
  }

  let handleChange = event => {
    setRoomName(event.target.value);
  };

  // TODO: should probably also add a submit button.
  return (
    <form
      className={classes.container}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <div>
        <TextField
          className={classes.textField}
          label="Enter Room Name"
          margin="normal"
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
