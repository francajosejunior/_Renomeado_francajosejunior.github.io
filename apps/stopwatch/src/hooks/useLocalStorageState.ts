import { useStorageState } from 'react-storage-hooks';

export function useLocalStorageState<S>(key: string, defaultValue: any = null) {
    return useStorageState<S>(localStorage, key, defaultValue);
}

