import { TCacheConfig } from '../signify-cache/cache.model';

export type TSignifyConfig = {
    cache?: TCacheConfig;
    syncKey?: string;
};

export type TSetterCallback<T> = (pre: { value: T }) => void;

export type TWrapProps<T> = { children(value: T): React.JSX.Element };

export type TListeners<T> = Set<(value: T) => void>;

export type TGetValueCb<T> = () => T;

export type TConvertValueCb<T, P> = (v: T) => P;

export type TUseValueCb<T> = (value: T) => void;

export type TConditionUpdate<T> = (pre: T, cur: T) => boolean;

export type TConditionRendering<T> = (value: T) => boolean;

export type TOmitHtml<T, P> = T extends string | number ? P : Omit<P, 'html'>;
