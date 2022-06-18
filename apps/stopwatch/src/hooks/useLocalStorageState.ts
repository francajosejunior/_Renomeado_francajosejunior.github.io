import { useStorageState } from 'react-storage-hooks';

export function useLocalStorageState(key: string, defaultValue: any = null) {
    return useStorageState(localStorage, key, defaultValue);
}

