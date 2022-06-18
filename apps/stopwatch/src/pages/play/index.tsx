import { createStyles, Fab, makeStyles, Theme } from "@material-ui/core";
import { Restore } from "@material-ui/icons";
import clsx from "clsx";
import { padStart, toInteger, toString } from "lodash";
import NoSleep from "nosleep.js";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { TimerConfiguration } from "../../types/timerConfiguration";
import Stopwtach from "../../util/stopwatch";
import { Title } from "./title";

var noSleep = new NoSleep();

const workaudioUrl =
  "https://notificationsounds.com/storage/sounds/file-sounds-1235-swift-gesture.mp3";

const restAudioUrl =
  "https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3";

const useStyles = makeStyles((theme: Theme) => {
  return {
    root: { display: "flex", flexDirection: "column", height: "100%" },
    play: {
      display: "flex",
      flex: 2,
      alignItems: "center",
      justifyContent: "space-evenly",
      flexWrap: "wrap",
    },
    display: {
      display: "flex",
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
    },
    displayWrapper: {
      display: "flex",
      flexDirection: "row",
      padding: "62px 40px",
      border: "solid 0.5px",
      borderRadius: "150px",
      boxShadow: "0px 2px 20px 4px",
      backgroundColor: (props: any) => {
        const ret = props.isPlaying
          ? props.isWorkingout
            ? "#608859"
            : "#905959"
          : "transparent"; //"#1eac05", //'#ca0c0c'

        return ret;
      },
    },
  };
});

let stopwatch: Stopwtach = new Stopwtach();

const Play: React.FC<{}> = () => {
  const secRef = useRef<any>();
  const humRef = useRef<any>();
  const { index } = useParams();

  const [x] = useLocalStorageState("timerList", []);
  const timerList = x as TimerConfiguration[];
  const timer = timerList[toInteger(index)];

  const [isWorkingout, setIsWorkingout] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!noSleep.isEnabled) {
      noSleep.enable();
    }
    stopwatch.onUpdateHundredth = (hundredth: number) =>
      (humRef.current.innerText = padStart(toString(hundredth), 2, "0"));

    stopwatch.onUpdateSecond = (second: number) =>
      (secRef.current.innerText = padStart(toString(second), 2, "0"));

    stopwatch.finishCallback = () =>
      setIsWorkingout((isWorkingout) => !isWorkingout);

    return () => {
      stopwatch?.stop();
      noSleep.disable();
    };
  }, []);

  useEffect(() => {
    stopwatch!.reset(isWorkingout ? timer.workOutTimer : timer.restTimer);
    navigator.vibrate([500, 200, 500]);
    const url = isWorkingout ? workaudioUrl : restAudioUrl;
    const audio = new Audio(url);
    audio.play();
  }, [isWorkingout, timer.restTimer, timer.workOutTimer]);

  useEffect(() => {
    if (isPlaying) stopwatch?.start();
    else stopwatch?.stop();
  }, [isPlaying]);

  const classes = useStyles({ isWorkingout, isPlaying });
  return (
    <div className={classes.root}>
      <Title isWorkingout={isWorkingout} timeConfig={timer} />
      <div className={classes.display}>
        <div
          className={clsx(classes.displayWrapper, isPlaying && "pulse")}
          onClick={() => setIsPlaying(!isPlaying)}
        >
          <h3
            style={{
              fontSize: "6rem",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: 400,
              lineHeight: 1.167,
              letterSpacing: "0em",
              margin: 0,
            }}
            ref={secRef}
          >
            00
          </h3>
          <p
            style={{
              fontSize: "3rem",
              fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
              fontWeight: "400",
              lineHeight: "1.5",
              letterSpacing: "0.00938em",
              margin: 0,
            }}
            ref={humRef}
          >
            00
          </p>
        </div>
      </div>
      <div className={classes.play}>
        <Fab
          color="primary"
          aria-label="add"
          size="large"
          onClick={() => {
            setIsPlaying(false);
            setIsWorkingout(true);
          }}
        >
          <Restore />
        </Fab>
      </div>
    </div>
  );
};

export default Play;
