import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles(theme => ({
  container: {},
  textField: {}
}));

export default function SearchBar(props) {
  const classes = useStyles();

  const [term, setTerm] = useState("");

  let handleSubmit = event => {
    event.preventDefault();
    props.handleSubmit(term);
  };

  let handleChange = event => {
    setTerm(event.target.value);
  };

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
          fullWidth
          label="Song Search"
          margin="normal"
          onChange={handleChange}
        />
      </div>
    </form>
  );
}
