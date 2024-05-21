export enum CacheType {
  Non = 'Non',
  LocalStorage = 'LocalStorage'
  //   SessionStorage,
  //   IndexDB
}

export type TCacheInfo = {
  type: CacheType;
  key: string;
  isSync?: boolean;
};
