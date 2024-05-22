export enum CacheType {
  None = 'None',
  LocalStorage = 'LocalStorage'
  //   SessionStorage,
  //   IndexDB
}

export type TCacheInfo = {
  type: CacheType;
  key: string;
  isSync?: boolean;
};
