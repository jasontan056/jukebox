import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import axios from 'axios';

const useStyles = makeStyles(theme => ({
    container: {
    },
    textField: {
    },
}));

export default function CreateRoom() {
    const classes = useStyles();
    const [roomName, setRoomName] = useState('');

    let handleSubmit = event => {
        event.preventDefault();
        axios.post('/api/room', {
            roomName: roomName,
          })
          .then(function (response) {
            const roomId = response.lastId;
            
            // TODO: navigate to the player page
          })
          .catch(function (error) {
            console.log(error);
          });
    };

    let handleChange = event => {
        setRoomName(event.target.value);
    }

    // TODO: should probably also add a submit button.
    return (
        <form className={classes.container} noValidate autoComplete="off"
            onSubmit={handleSubmit}>
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
};