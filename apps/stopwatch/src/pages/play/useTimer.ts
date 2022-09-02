/* eslint-disable import/no-anonymous-default-export */
import NoSleep from "nosleep.js";
import { useEffect, useRef, useState } from "react";
import { useLocalStorageState } from "../../hooks/useLocalStorageState";
import { UseTimerProps, UseTimerResult } from "./types";

const workaudioUrl =
    "https://notificationsounds.com/storage/sounds/file-sounds-1235-swift-gesture.mp3";

const restAudioUrl =
    "https://notificationsounds.com/storage/sounds/file-sounds-1233-elegant.mp3";

let noSleep = new NoSleep();
let tick = 0

export default ({
    intervals,
    onUpdateTick
}: UseTimerProps): UseTimerResult => {
    const [isWorkingout, setIsWorkingout] = useState<boolean>(true)
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasPlayed, setHasPlayed] = useState<boolean>(false);
    const [countDown, setCountDown] = useState<number | null>(null);
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

        const limitMs = limit * 1000
        const msStep = 10


        if (isPlaying)
            interval = setInterval(() => {
                tick += msStep
                onUpdateTick(tick)

                if (tick >= limitMs) {
                    setIsWorkingout(isWorkingout => !isWorkingout)
                    tick = 0
                    onUpdateTick(tick)
                }
            }, msStep)

        return () => {
            clearInterval(interval)
        }

    }, [intervals, isPlaying, isWorkingout, onUpdateTick]);

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

    useEffect(() => {
        let t: any;
        if (countDown !== null) {
            t = setTimeout(() => { setCountDown(countDown - 1) }, 1000)
        }

        if (countDown !== null && countDown < 0) {
            setCountDown(null)
            setIsPlaying(true)
            setHasPlayed(true)
        }



        return () => clearTimeout(t)
    }, [countDown, isPlaying])



    const play = () => {
        if (isPlaying)
            setIsPlaying(false)
        else
            setCountDown(3);
    }
    const reset = () => {
        tick = 0
        setIsPlaying(false)
        setHasPlayed(false)
        setIsWorkingout(true)
        onUpdateTick(tick)
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
        isVibOn, countDown,
        play,
        reset,
        toggleSound,
        toggleVid,
    } as UseTimerResult;
}