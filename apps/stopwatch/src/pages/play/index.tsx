import { Fab, makeStyles, Theme } from "@material-ui/core";
import { Restore } from "@material-ui/icons";
import clsx from "clsx";
import { padStart, toInteger, toString } from "lodash";
import NoSleep from "nosleep.js";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import SwitchSound from "../../components/switchSound";
import SwitchVib from "../../components/switchVib";
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
  const [hasPlayed, setHasPlayed] = useState<boolean>(false);
  const [isSoundOn, setSoundOn] = useLocalStorageState<boolean>(
    "isSoundOn",
    true
  );
  const isSoundOnRef = useRef<boolean>(isSoundOn);

  const [isVibOn, setVibOn] = useLocalStorageState<boolean>("isVibOn", true);
  const isVibOnRef = useRef<boolean>(isVibOn);

  const secRef = useRef<any>();
  const humRef = useRef<any>();
  const { index } = useParams();

  const [list]: [
    timerList: TimerConfiguration[],
    setList: Dispatch<SetStateAction<TimerConfiguration[]>>,
    error: Error | undefined
  ] = useLocalStorageState("timerList", []);

  const timer = list[toInteger(index)];

  const [isWorkingout, setIsWorkingout] = useState<boolean>(true);
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
    if (hasPlayed) {
      stopwatch!.reset(isWorkingout ? timer.workOutTimer : timer.restTimer);
      if (isVibOnRef.current) {
        navigator.vibrate([500, 200, 500]);
      }
      if (isSoundOnRef.current) {
        const url = isWorkingout ? workaudioUrl : restAudioUrl;
        const audio = new Audio(url);
        audio.play();
      }
    }
  }, [isWorkingout, hasPlayed, timer.restTimer, timer.workOutTimer]);

  useEffect(() => {
    if (isPlaying) {
      stopwatch?.start();
    } else stopwatch?.stop();
  }, [isPlaying]);

  const classes = useStyles({ isWorkingout, isPlaying });
  return (
    <div className={classes.root}>
      <Title isWorkingout={isWorkingout} timeConfig={timer} />
      <div className={classes.display}>
        <div
          className={clsx(classes.displayWrapper, isPlaying && "pulse")}
          onClick={() => {
            setIsPlaying(!isPlaying);
            setHasPlayed(true);
          }}
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
          aria-label="reset"
          size="large"
          onClick={() => {
            stopwatch!.reset(timer.workOutTimer);
            setIsPlaying(false);
            setIsWorkingout(true);
          }}
        >
          <Restore />
        </Fab>
        <SwitchSound
          isSoundOn={isSoundOn}
          switchSound={() =>
            setSoundOn((isSoundOn) => {
              isSoundOnRef.current = !isSoundOn;
              return !isSoundOn;
            })
          }
        />
        <SwitchVib
          isVibOn={isVibOn}
          switchVib={() =>
            setVibOn((isVibOn) => {
              isVibOnRef.current = !isVibOn;
              return !isVibOn;
            })
          }
        />
      </div>
    </div>
  );
};

export default Play;
