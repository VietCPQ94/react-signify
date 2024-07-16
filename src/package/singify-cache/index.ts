import { TCacheConfig, TCacheSolution } from './cache.model';

const cacheSolution: TCacheSolution = {
    LocalStorage: localStorage,
    SesionStorage: sessionStorage
};

export const getInitialValue = <T>(initialValue: T, cacheInfo?: TCacheConfig): T => {
    if (cacheInfo?.key) {
        const mainType = cacheInfo?.type ?? 'LocalStorage';
        const tempValue = cacheSolution[mainType].getItem(cacheInfo.key);

        if (!tempValue) {
            cacheSolution[mainType].setItem(cacheInfo.key, JSON.stringify(initialValue));
            return initialValue;
        } else {
            return JSON.parse(tempValue);
        }
    }

    return initialValue;
};

export const cacheUpdateValue = <T>(newValue: T, cacheInfo?: TCacheConfig) => {
    if (cacheInfo?.key) {
        cacheSolution[cacheInfo?.type ?? 'LocalStorage'].setItem(cacheInfo.key, JSON.stringify(newValue));
    }
};
