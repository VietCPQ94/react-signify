import { CacheType, TCacheInfo } from './cache.model';

export const getInitialValue = <T>(initialValue: T, cacheInfo?: TCacheInfo): T => {
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

export const cacheSyncControl = <T>(cb: (newValue: T) => void, cacheInfo?: TCacheInfo) => {
  if (!cacheInfo || !cacheInfo.key || !cacheInfo.isSync) {
    return;
  }

  window.addEventListener('storage', function (event) {
    if (event.key === cacheInfo.key && event.newValue) {
      cb(JSON.parse(event.newValue));
    }
  });
};

export const cacheUpdateValue = <T>(newValue: T, cacheInfo?: TCacheInfo) => {
  if (cacheInfo?.type && cacheInfo.key) {
    localStorage.setItem(cacheInfo.key, JSON.stringify(newValue));
  }
};
