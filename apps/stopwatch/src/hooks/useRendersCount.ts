import { useRef } from 'react';

export function useRendersCount() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const renderCounter = useRef<number>(0);
    renderCounter.current = renderCounter.current + 1;
    const resetCounter = () => renderCounter.current = 0;
    return [renderCounter.current, resetCounter];
}
