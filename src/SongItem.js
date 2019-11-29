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
    padding: theme.spacing(0.5),
    margin: "auto",
    backgroundColor: "#ffffff40"
  },
  paperHighlighted: {
    backgroundColor: "#af18bd61"
  },
  img: {
    width: 60,
    height: 45
  },
  imgContainer: {
    textAlign: "center"
  },
  addToPlaylistButton: {
    padding: 8
  }
}));

export default function SongItem(props) {
  const classes = useStyles();

  let playlistAddButton;
  if (props.showPlaylistAddButton) {
    playlistAddButton = (
      <Grid item xs={1.5}>
        <IconButton
          aria-label="playlistAdd"
          className={classes.addToPlaylistButton}
          onClick={() => props.onPlaylistAddButtonClicked()}
        >
          <PlaylistAddIcon />
        </IconButton>
      </Grid>
    );
  }

  let paperClassName;
  if (props.highlighted) {
    paperClassName = classNames(classes.paper, classes.paperHighlighted);
  } else {
    paperClassName = classes.paper;
  }

  return (
    <div>
      <Paper className={paperClassName}>
        <Grid container spacing={1}>
          <Grid item xs={2} className={classes.imgContainer}>
            <img className={classes.img} alt="complex" src={props.thumbnail} />
          </Grid>
          <Grid item xs container direction="column" spacing={2} zeroMinWidth>
            <Grid item xs>
              <Typography variant="body1" noWrap>
                {props.title}
              </Typography>
              <Typography variant="subtitle2" noWrap color="textSecondary">
                {props.channelTitle}
              </Typography>
            </Grid>
          </Grid>
          {playlistAddButton}
        </Grid>
      </Paper>
    </div>
  );
}
