import { TimerConfiguration } from '../types/timerConfiguration';
import { useStorageState } from 'react-storage-hooks';

export function useTimerState(initial: TimerConfiguration[]) {
    const [list, setList] = useStorageState<TimerConfiguration[]>(localStorage, "timerList", initial);
    return [
        list as TimerConfiguration[],
        setList as React.Dispatch<React.SetStateAction<TimerConfiguration[]>>
    ];
}
