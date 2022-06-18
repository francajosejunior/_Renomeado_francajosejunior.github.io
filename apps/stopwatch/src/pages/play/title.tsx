import { createStyles, makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { TimerConfiguration } from "../../types/timerConfiguration";
import clsx from "clsx";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      display: "flex",
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    active: { fontWeight: "bold", fontSize: "2em" },
  })
);

export const Title: React.FC<{
  isWorkingout: boolean;
  timeConfig: TimerConfiguration;
}> = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.title}>
      <Typography paragraph>
        <span className={clsx(props.isWorkingout && classes.active)}>
          {props.timeConfig.workOutTimer}
        </span>
        :
        <span className={clsx(!props.isWorkingout && classes.active)}>
          {props.timeConfig.restTimer}
        </span>
      </Typography>
    </div>
  );
};
