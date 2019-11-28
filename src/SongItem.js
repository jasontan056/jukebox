import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import PlaylistAddIcon from "@material-ui/icons/PlaylistAdd";
import classNames from "classnames";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    //  padding: theme.spacing(2),
    margin: "auto",
    maxWidth: 500
  },
  paperHighlighted: {
    backgroundColor: "#dedede"
  },
  img: {
    width: 120,
    height: 90
  }
}));

export default function SongItem(props) {
  const classes = useStyles();

  let playlistAddButton;
  if (props.showPlaylistAddButton) {
    playlistAddButton = (
      <IconButton
        aria-label="playlistAdd"
        onClick={() => props.onPlaylistAddButtonClicked()}
      >
        <PlaylistAddIcon />
      </IconButton>
    );
  }

  let paperClassName;
  if (props.highlighted) {
    paperClassName = classNames(classes.paper, classes.paperHighlighted);
  } else {
    paperClassName = classes.paper;
  }

  return (
    <div className={classes.root}>
      <Paper className={paperClassName}>
        <Grid container spacing={2}>
          <Grid item>
            <img className={classes.img} alt="complex" src={props.thumbnail} />
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography variant="body2" gutterBottom>
                  {props.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {props.channelTitle}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid>{playlistAddButton}</Grid>
        </Grid>
      </Paper>
    </div>
  );
}
