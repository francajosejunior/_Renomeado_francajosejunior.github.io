import { Dispatch, SetStateAction } from "react";
import { TimerConfiguration } from "../../types/timerConfiguration";

export type TimeListStateType = [
    timerList: TimerConfiguration[],
    setList: Dispatch<SetStateAction<TimerConfiguration[]>>,
    error: Error | undefined
]