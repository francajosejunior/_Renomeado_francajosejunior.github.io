import { TimerConfiguration } from '../types/timerConfiguration';
import { useStorageState } from 'react-storage-hooks';
import { useRef } from 'react';

export function useTimerState(initial: TimerConfiguration[]) {
    const [list, setList] = useStorageState<TimerConfiguration[]>(localStorage, "timerList", initial);
    return [
        list as TimerConfiguration[],
        setList as React.Dispatch<React.SetStateAction<TimerConfiguration[]>>
    ];
}


export function useRendersCount() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const renderCounter = useRef<number>(0);
    renderCounter.current = renderCounter.current + 1;
    const resetCounter = () => renderCounter.current = 0
    return [renderCounter.current, resetCounter]
}