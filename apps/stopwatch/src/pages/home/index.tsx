import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  TextField,
} from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import AccessAlarmIcon from "@material-ui/icons/AccessAlarm";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import { toInteger } from "lodash";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { TimerConfiguration } from "../../types/timerConfiguration";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: { display: "flex" },
    list: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    addButton: {
      position: "fixed",
      bottom: 10,
      left: "50%",
      marginLeft: "-28px",
    },
    addButtonContainer: {
      width: "auto",
    },
  })
);

const initialTimeConfig: TimerConfiguration = { restTimer: 0, workOutTimer: 0 };

function Home() {
  const navigate = useNavigate();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [timeConf, setTimeCong] =
    useState<TimerConfiguration>(initialTimeConfig);

  const [x, setList] = useLocalStorageState("timerList", []);
  const list = x as TimerConfiguration[];

  const handleListClick = (index: number) => (e: any) => {
    e.preventDefault();
    navigate(`/play/${index}`);
  };

  const handleDeleteClick = (index: number) => () => {
    setList(list.filter((item, i) => i !== index));
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setTimeCong(initialTimeConfig);
    setOpen(false);
  };
  const handleAdd = () => {
    console.log({ timeConf });
    if (timeConf?.restTimer > 0 && timeConf?.workOutTimer > 0) {
      setList([...list, timeConf]);
      setTimeCong(initialTimeConfig);
      setOpen(false);
    }
  };

  return (
    <div className={classes.root}>
      <List className={classes.list}>
        {list.map((item, index) => {
          return (
            <ListItem
              key={index}
              role={undefined}
              dense
              button
              onClick={handleListClick(index)}
            >
              <ListItemIcon>
                <AccessAlarmIcon />
              </ListItemIcon>
              <ListItemText
                primary={`${item.workOutTimer}:${item.restTimer}`}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  aria-label="comments"
                  onClick={handleDeleteClick(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          );
        })}
      </List>
      <Fab
        color="primary"
        aria-label="add"
        className={classes.addButton}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          ADD Timer configurations
        </DialogTitle>
        <DialogContent>
          <DialogContentText>...</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="Workout Timer"
            label="Workout Timer"
            fullWidth
            type="number"
            inputProps={{ pattern: "d*" }}
            onChange={(e) => {
              setTimeCong({
                ...timeConf,
                workOutTimer: toInteger(e.target.value),
              });
            }}
            value={timeConf.workOutTimer}
          />
          <TextField
            autoFocus
            margin="dense"
            id="Rest Timer"
            label="Rest Timer"
            fullWidth
            type="number"
            inputProps={{ pattern: "d*" }}
            onChange={(e) => {
              setTimeCong({
                ...timeConf,
                restTimer: toInteger(e.target.value),
              });
            }}
            value={timeConf.restTimer}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Home;
