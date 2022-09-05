import { makeStyles, Theme } from "@material-ui/core";

export const useStyles = makeStyles((theme: Theme) => {
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
      padding: "62px 50px",
      border: "solid 0.5px",
      borderRadius: "150px",
      boxShadow: "0px 2px 20px 4px",
      height: "auto",
      width: "auto",
      color: "white",
      backgroundColor: (props: any) => {
        const ret = props.isPlaying
          ? props.isWorkingout
            ? "#608859"
            : "#905959"
          : "#1e1e1e"; //"#1eac05", //'#ca0c0c'

        return ret;
      },
    },
    countDown: {
      backgroundColor: "rgba(0,0,0,.8)",
      position: "fixed",
      top: 0,
      left: 0,
      height: "100vh",
      width: "100vw",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "9em",
      color: "white",
    },
  };
});
