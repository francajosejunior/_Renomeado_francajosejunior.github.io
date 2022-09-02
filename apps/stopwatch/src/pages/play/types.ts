import { Dispatch, SetStateAction } from "react";
import { TimerConfiguration } from "../../types/timerConfiguration";

export type TimeListStateType = [
    timerList: TimerConfiguration[],
    setList: Dispatch<SetStateAction<TimerConfiguration[]>>,
    error: Error | undefined
]

export interface UseTimerResult {
    isWorkingout: boolean,
    isPlaying: boolean,
    isSoundOn: boolean,
    isVibOn: boolean,
    countDown: number | null,
    play: () => void,
    reset: () => void,
    toggleSound: () => void,
    toggleVid: () => void,
}

export interface UseTimerProps {
    intervals: [number, number],
    onUpdateTick: (tick: number) => void
}