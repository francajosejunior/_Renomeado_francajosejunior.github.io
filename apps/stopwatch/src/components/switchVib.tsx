import { Fab } from "@material-ui/core";
import { Vibration } from "@material-ui/icons";
import React from "react";

const SwitchVib: React.FC<{
  isVibOn: boolean;
  switchVib: () => void;
}> = ({ isVibOn, switchVib }) => {
  const color = isVibOn ? "primary" : "default";
  return (
    <Fab color={color} aria-label="reset" size="large" onClick={switchVib}>
      <Vibration />
    </Fab>
  );
};

export default SwitchVib;
