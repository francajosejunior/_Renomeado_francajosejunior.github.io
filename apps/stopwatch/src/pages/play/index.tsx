import { Fab } from "@material-ui/core";
import { Restore } from "@material-ui/icons";
import clsx from "clsx";
import { isNil, padStart, toInteger } from "lodash";
import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import SwitchSound from "../../components/switchSound";
import SwitchVib from "../../components/switchVib";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { Title } from "./title";
import { TimeListStateType, UseTimerProps } from "./types";
import { useStyles } from "./useStyles";
import useTimer from "./useTimer";

const Play: React.FC<{}> = () => {
  const { index } = useParams();

  const [list]: TimeListStateType = useLocalStorageState("timerList", []);
  const timer = list[toInteger(index)];

  const secRef = useRef<any>();
  const humRef = useRef<any>();

  const config: UseTimerProps = {
    intervals: [timer.workOutTimer, timer.restTimer],
    onUpdateTick: (tick: number) => {
      var s = (tick / 1000).toFixed(0);
      var m = tick.toString().padStart(4, "0").substring(1, 2);
      secRef.current.innerText = s.padStart(2, "0");
      humRef.current.innerText = m;
    },
  };

  const {
    isWorkingout,
    isPlaying,
    isSoundOn,
    isVibOn,
    countDown,
    play,
    reset,
    toggleSound,
    toggleVid,
  } = useTimer(config);

  const classes = useStyles({ isWorkingout, isPlaying });
  return (
    <div className={classes.root}>
      <Title isWorkingout={isWorkingout} timeConfig={timer} />
      <div className={classes.display}>
        <Fab
          className={clsx(classes.displayWrapper, isPlaying && "pulse")}
          onClick={play}
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
        </Fab>
      </div>
      <div className={classes.play}>
        <Fab color="primary" aria-label="reset" size="large" onClick={reset}>
          <Restore />
        </Fab>
        <SwitchSound isSoundOn={isSoundOn} switchSound={toggleSound} />
        <SwitchVib isVibOn={isVibOn} switchVib={toggleVid} />
      </div>
      {!isNil(countDown) && (
        <div className={classes.countDown}>{countDown}</div>
      )}
    </div>
  );
};

export default Play;
