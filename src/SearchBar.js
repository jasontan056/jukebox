import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import SearchIcon from "@material-ui/icons/Search";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles(theme => ({
  container: {},
  textField: {}
}));

const SearchBar = React.forwardRef((props, ref) => {
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
      <TextField
        inputRef={ref}
        className={classes.textField}
        fullWidth
        variant="filled"
        label="Find your jam!"
        margin="normal"
        onChange={handleChange}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="search"
                onClick={() => props.handleSubmit(term)}
              >
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    </form>
  );
});

export default SearchBar;
