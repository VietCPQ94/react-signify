import { CacheType, TCacheInfo } from './cache.model';

export const getInitialValue = <T>(initialValue: T, cacheInfo: TCacheInfo = { type: CacheType.Non, key: '' }): T => {
  return {
    [CacheType.Non]: initialValue,
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

export const cacheSyncControl = <T>(cacheInfo: TCacheInfo = { type: CacheType.Non, key: '' }, cb: (newValue: T) => void) => {
  if (!cacheInfo.isSync) {
    return;
  }

  window.addEventListener('storage', function (event) {
    if (event.key === cacheInfo.key && event.newValue) {
      cb(JSON.parse(event.newValue));
    }
  });
};
