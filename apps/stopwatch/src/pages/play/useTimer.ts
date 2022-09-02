/* eslint-disable import/no-anonymous-default-export */

import { useEffect, useRef, useState } from "react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";

import NoSleep from "nosleep.js";

const workaudioUrl =
    "https://notificationsounds.com/storage/sounds/file-sounds-1235-swift-gesture.mp3";

const restAudioUrl =
    "https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3";

var noSleep = new NoSleep();

export interface UseTimerProps {
    intervals: [number, number],
    onUpdateHundredth: (currentHundredth: number) => void,
    onUpdateSecond: (currentSecond: number) => void
}

export interface UseTimerResult {
    isWorkingout: boolean,
    isPlaying: boolean,
    isSoundOn: boolean,
    isVibOn: boolean,
    play: () => void,
    reset: () => void,
    toggleSound: () => void,
    toggleVid: () => void,
}

let currentSecond = 0,
    currentHundredth = 0

export default ({
    intervals,
    onUpdateHundredth,
    onUpdateSecond
}: UseTimerProps): UseTimerResult => {
    console.log("Render")
    const [isWorkingout, setIsWorkingout] = useState<boolean>(true)
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState<boolean>(false);

    const [isSoundOn, setSoundOn] = useLocalStorageState<boolean>(
        "isSoundOn",
        true
    );
    const isSoundOnRef = useRef<boolean>(isSoundOn);

    const [isVibOn, setVibOn] = useLocalStorageState<boolean>("isVibOn", true);
    const isVibOnRef = useRef<boolean>(isVibOn);


    useEffect(() => {

        let interval: any
        const limit = intervals[isWorkingout ? 0 : 1]


        if (isPlaying)
            interval = setInterval(() => {

                currentHundredth += 1
                if (currentHundredth >= 100) {
                    currentSecond += 1
                    currentHundredth = 0
                    onUpdateSecond(currentSecond)
                }

                onUpdateHundredth(currentHundredth)

                if (currentSecond >= limit) {
                    setIsWorkingout(isWorkingout => !isWorkingout)
                    currentSecond = 0
                    currentHundredth = 0
                    onUpdateSecond(currentSecond)
                    onUpdateHundredth(currentHundredth)
                }
            }, 10)

        return () => {
            clearInterval(interval)
        }

    }, [intervals, isPlaying, isWorkingout, onUpdateHundredth, onUpdateSecond]);

    useEffect(() => {
        if (hasPlayed) {
            if (isVibOnRef.current) {
                navigator.vibrate([500, 200, 500]);
            }
            if (isSoundOnRef.current) {
                const url = isWorkingout ? workaudioUrl : restAudioUrl;
                const audio = new Audio(url);
                audio.play();
            }
        }
    }, [isWorkingout, hasPlayed]);


    useEffect(() => {
        if (!noSleep.isEnabled) {
            noSleep.enable();
        }
    }, []);


    const play = () => {
        setIsPlaying(!isPlaying)
        setHasPlayed(true)
    }
    const reset = () => {
        currentSecond = 0
        currentHundredth = 0
        setIsPlaying(false)
        setHasPlayed(false)
        setIsWorkingout(true)
        onUpdateHundredth(currentHundredth)
        onUpdateSecond(currentSecond)
    }

    const toggleSound = () => {
        setSoundOn(isSoundOn => {
            isSoundOnRef.current = !isSoundOn
            return !isSoundOn
        })
    }
    const toggleVid = () => {
        setVibOn(x => {
            isVibOnRef.current = !x
            return !x
        })
    }
    return {
        isWorkingout,
        isPlaying,
        isSoundOn,
        isVibOn,
        play,
        reset,
        toggleSound,
        toggleVid,
    } as UseTimerResult;
}