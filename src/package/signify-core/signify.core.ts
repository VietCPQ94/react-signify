import React, { DependencyList, memo, useLayoutEffect, useRef, useState } from 'react';
import { deepCompare } from '../utils/objectCompare';
import { TConvertValueCb, TGetValueCb, TListeners, TUseValueCb, TWrapProps } from './signify.model';

/**
 * watchCore is a custom hook that subscribes to a set of listeners.
 * It allows the provided callback to be invoked whenever the state changes.
 * The listeners will be cleaned up when the component unmounts or dependencies change.
 *
 * @param listeners - A collection of listeners for state changes.
 * @returns A function that takes a callback and an optional dependency array.
 */
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

/**
 * useCore is a custom hook that retrieves a value from the state and triggers
 * a re-render when the value changes. It allows you to transform the retrieved
 * value using a provided conversion function.
 *
 * @param listeners - A collection of listeners for state changes.
 * @param getValue - A function to retrieve the current value from the state.
 * @returns A function that takes an optional value conversion function. v => v as Readonly<P>
 */
export const useCore =
    <T>(listeners: TListeners<T>, getValue: () => T) =>
    <P = undefined>(pickValue?: TConvertValueCb<T, P>) => {
        const trigger = useState({})[1];
        const listener = useRef(
            (() => {
                let temp = pickValue?.(getValue());
                const listenerFunc = () => {
                    if (pickValue) {
                        let newTemp = pickValue(getValue());

                        if (deepCompare(temp, newTemp)) {
                            return;
                        }
                        temp = newTemp;
                    }

                    trigger({});
                };
                return listenerFunc;
            })()
        );

        useLayoutEffect(() => {
            listeners.add(listener.current);
            return () => {
                listeners.delete(listener.current);
            };
        }, []);

        return (pickValue ? pickValue(getValue()) : getValue()) as P extends undefined ? T : P;
    };

/**
 * htmlCore is a utility function that creates a React element by invoking
 * the provided value retrieval function. This is useful for rendering
 * values directly in a functional component.
 *
 * @param u - A function that retrieves the current value.
 * @returns A React element containing the rendered value.
 */
//@ts-ignore
export const htmlCore = <T>(u: TGetValueCb<T>) => React.createElement(() => u());

/**
 * WrapCore is a higher-order component that wraps its children with the
 * current value retrieved from the provided function.
 *
 * @param u - A function that retrieves the current value.
 * @returns A component that renders its children with the current value.
 *
 * @example
 * const getValue = () => 'Wrapped Value';
 * const WrappedComponent = WrapCore(getValue);
 */
export const WrapCore =
    <T>(u: TGetValueCb<T>) =>
    ({ children }: TWrapProps<T>) =>
        children(u());

/**
 * HardWrapCore is a memoized version of WrapCore that optimizes rendering
 * by preventing unnecessary updates. It uses shallow comparison to determine
 * if the component should re-render.
 *
 * @param u - A function that retrieves the current value.
 * @returns A memoized component that wraps its children with the current value.
 */
export const HardWrapCore = <T>(u: TGetValueCb<T>) => memo(WrapCore<T>(u), () => true) as ReturnType<typeof WrapCore<T>>;
