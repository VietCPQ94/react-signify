import { TCacheConfig } from '../singify-cache/cache.model';

export type TSignifyConfig = {
    cache?: TCacheConfig;
    syncKey?: string;
};

export type TSetterCallback<T> = (pre: { value: T }) => void;

export type TWrapProps<T> = { children(value: Readonly<T>): React.JSX.Element };

export type TListeners<T> = Set<(value: Readonly<T>) => void>;

export type TGetValueCb<T> = () => Readonly<T>;

export type TConvertValueCb<T, P> = (v: Readonly<T>) => P;

export type TUseValueCb<T> = (value: Readonly<T>) => void;

export type TConditionUpdate<T> = (pre: Readonly<T>, cur: Readonly<T>) => boolean;

export type TConditionRendering<T> = (value: Readonly<T>) => boolean;

export type TOmitHtml<T, P> = T extends string | number ? P : Omit<P, 'html'>;
