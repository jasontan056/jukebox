import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

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
        // here i should create a room and navigate
        // to the next page
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