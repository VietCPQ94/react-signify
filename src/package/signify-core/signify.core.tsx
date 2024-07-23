import { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { TGetValueCb, TListeners, TUseValueCb, TWrapProps } from './signify.model';

export const watchCore =
    <T,>(listeners: TListeners<T>) =>
    (callback: TUseValueCb<T>, deps?: DependencyList) => {
        useLayoutEffect(() => {
            listeners.add(callback);

            return () => {
                listeners.delete(callback);
            };
        }, deps ?? []);
    };

export const useCore =
    <T,>(listeners: Set<(value: T) => void>, pickValue: () => T) =>
    <P = undefined,>(pick?: (v: T) => P) => {
        const trigger = useState({})[1];

        useLayoutEffect(() => {
            const listener = () => trigger({});
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        }, []);

        const result = pick ? pick(pickValue()) : pickValue();

        return result as P extends undefined ? T : P;
    };

export const htmlCore = <T,>(u: TGetValueCb<T>) => jsx(() => <>{u()}</>, {});

export const WrapCore =
    <T,>(u: TGetValueCb<T>) =>
    ({ children }: TWrapProps<T>) =>
        children(u());

export const HardWrapCore = <T,>(u: TGetValueCb<T>) => memo(WrapCore<T>(u), () => true) as ReturnType<typeof WrapCore<T>>;
