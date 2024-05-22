import { CacheType, TCacheConfig } from './cache.model';

export const getInitialValue = <T>(initialValue: T, cacheInfo?: TCacheConfig): T => {
  if (!cacheInfo) {
    cacheInfo = {
      key: '',
      type: CacheType.None
    };
  }
  return {
    [CacheType.None]: initialValue,
    [CacheType.LocalStorage]: (() => {
      let temp = localStorage.getItem(cacheInfo.key);
      if (!temp) {
        localStorage.setItem(cacheInfo.key, JSON.stringify(initialValue));
        return initialValue;
      } else {
        return JSON.parse(temp);
      }
    })()
  }[cacheInfo.type];
};

export const cacheUpdateValue = <T>(newValue: T, cacheInfo?: TCacheConfig) => {
  if (cacheInfo?.type && cacheInfo.key) {
    localStorage.setItem(cacheInfo.key, JSON.stringify(newValue));
  }
};
