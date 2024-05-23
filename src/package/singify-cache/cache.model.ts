export enum CacheType {
  None = 'None',
  LocalStorage = 'LocalStorage'
}

export type TCacheConfig = {
  type: CacheType;
  key: string;
};
