import { TimerConfiguration } from '../types/timerConfiguration';
import { useStorageState } from 'react-storage-hooks';
import { useEffect, useRef } from 'react';

export function useTimerState(initial: TimerConfiguration[]) {
    const [list, setList] = useStorageState<TimerConfiguration[]>(localStorage, "timerList", initial);
    return [
        list as TimerConfiguration[],
        setList as React.Dispatch<React.SetStateAction<TimerConfiguration[]>>
    ];
}

export const useDidMount = () => {
    const isMountRef = useRef(false);
    useEffect(() => {
        isMountRef.current = true;
    }, []);
    return isMountRef.current;
};