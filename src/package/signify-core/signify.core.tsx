import { DependencyList, memo, useLayoutEffect, useState } from 'react';
import { jsx } from 'react/jsx-runtime';
import { TWrapProps } from './signify.model';

export const watchCore =
    <P,>(listeners: Set<(newValue: P) => void>) =>
    (callback: (newValue: P) => void, deps?: DependencyList) => {
        useLayoutEffect(() => {
            listeners.add(callback);

            return () => {
                listeners.delete(callback);
            };
        }, deps ?? []);
    };

export const useCore =
    <P,>(listeners: Set<(newValue: P) => void>, pickValue: () => Readonly<P>) =>
    () => {
        const trigger = useState({})[1];

        useLayoutEffect(() => {
            const listener = () => trigger({});
            listeners.add(listener);

            return () => {
                listeners.delete(listener);
            };
        }, []);

        return pickValue();
    };

export const htmlCore = <P,>(u: () => Readonly<P>) => jsx(() => <>{u()}</>, {});

export const WrapCore =
    <P,>(u: () => Readonly<P>) =>
    ({ children }: TWrapProps<P>) =>
        children(u());

export const HardWrapCore = <P,>(u: () => Readonly<P>) => memo(WrapCore(u), () => true) as ReturnType<typeof WrapCore>;
