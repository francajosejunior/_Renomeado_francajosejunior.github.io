import { Fab } from "@material-ui/core";
import { VolumeUp, VolumeOff } from "@material-ui/icons";
import React from "react";

const SwitchSound: React.FC<{
  isSoundOn: boolean;
  switchSound: () => void;
}> = ({ isSoundOn, switchSound }) => {
  const color = isSoundOn ? "primary" : "default";
  return (
    <Fab color={color} aria-label="reset" size="large" onClick={switchSound}>
      <VolumeUp />
    </Fab>
  );
};

export default SwitchSound;
