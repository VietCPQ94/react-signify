export enum CacheType {
  None = 'None',
  LocalStorage = 'LocalStorage'
  //   SessionStorage,
  //   IndexDB
}

export type TCacheConfig = {
  type: CacheType;
  key: string;
};
