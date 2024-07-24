import React, { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { TConvertValueCb, TGetValueCb, TListeners, TUseValueCb, TWrapProps } from './signify.model';

export const watchCore =
    <T>(listeners: TListeners<T>) =>
    (callback: TUseValueCb<T>, deps?: DependencyList) => {
        useLayoutEffect(() => {
            listeners.add(callback);

            return () => {
                listeners.delete(callback);
            };
        }, deps ?? []);
    };

export const useCore =
    <T>(listeners: TListeners<T>, getValue: () => T) =>
    <P = undefined>(pickValue: TConvertValueCb<T, P> = v => v as P) => {
        const trigger = useState({})[1];

        useLayoutEffect(() => {
            const listener = () => trigger({});
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        }, []);

        return pickValue(getValue()) as P extends undefined ? Readonly<T> : Readonly<P>;
    };

// @ts-ignore
export const htmlCore = <T>(u: TGetValueCb<T>) => React.createElement(() => u());

export const WrapCore =
    <T>(u: TGetValueCb<T>) =>
    ({ children }: TWrapProps<T>) =>
        children(u());

export const HardWrapCore = <T>(u: TGetValueCb<T>) => memo(WrapCore<T>(u), () => true) as ReturnType<typeof WrapCore<T>>;
