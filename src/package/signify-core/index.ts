import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { deepClone } from '../utils/objectClone';
import { deepCompare } from '../utils/objectCompare';
import { HardWrapCore, WrapCore, htmlCore, useCore, watchCore } from './signify.core';
import { TConditionRendering, TConditionUpdate as TConditionUpdating, TListeners, TOmitHtml, TSetterCallback, TSignifyConfig, TUseValueCb } from './signify.model';

/**
 * Signify class for managing a reactive state in a React environment.
 *
 * This class encapsulates the state management logic, providing features such
 * as synchronization with external systems, conditional updates and rendering,
 * and various utilities to interact with the state.
 *
 * @template T - Type of the state value.
 */
class Signify<T = unknown> {
    private _isRender = true; // Indicates whether the component should re-render.
    private _initialValue: T; // Stores the initial value of the state.
    private _value: T; // Current value of the state.
    private _config?: TSignifyConfig; // Configuration options for Signify.
    private _listeners: TListeners<T> = new Set(); // Listeners for state changes.
    private _syncSetter?: TUseValueCb<T>; // Function to synchronize state externally.
    private _conditionUpdating?: TConditionUpdating<T>; // Condition for updating the state.
    private _conditionRendering?: TConditionRendering<T>; // Condition for rendering.

    /**
     * Constructor to initialize the Signify instance with an initial value and optional configuration.
     *
     * @param initialValue - The initial value of the state.
     * @param config - Optional configuration settings for state management.
     */
    constructor(initialValue: T, config?: TSignifyConfig) {
        this._initialValue = initialValue; // set initial value.
        this._value = getInitialValue(deepClone(initialValue), config?.cache); // Get initial value considering caching.
        this._config = config;

        // If synchronization is enabled, setup the sync system.
        if (config?.syncKey) {
            const { post, sync } = syncSystem<T>({
                key: config.syncKey,
                cb: data => {
                    this._value = data; // Update local state with synchronized value.
                    cacheUpdateValue(this.value, this._config?.cache); // Update cache with new value.
                    this._inform(); // Notify listeners about the state change.
                }
            });

            this._syncSetter = post; // Assign the sync setter function.

            sync(() => this.value); // Sync on value changes.
        }
    }

    /**
     * Inform all listeners about the current value if rendering is allowed.
     */
    private _inform = () => {
        if (this._isRender && (!this._conditionRendering || this._conditionRendering(this.value))) {
            this._listeners.forEach(listener => listener(this.value)); // Notify each listener with the current value.
        }
    };

    /**
     * Force update the current state and inform listeners of the change.
     *
     * @param value - New value to set.
     */
    private _forceUpdate = (value?: T) => {
        if (value !== undefined) {
            this._value = value; // Update current value.
        }
        cacheUpdateValue(this.value, this._config?.cache); // Update cache if applicable.
        this._syncSetter?.(this.value); // Synchronize with external system if applicable.
        this._inform(); // Notify listeners about the new value.
    };

    /**
     * Getter for obtaining the current value of the state.
     */
    get value(): Readonly<T> {
        return this._value;
    }

    /**
     * Setter function to update the state. Can take a new value or a callback function which use to update value directly.
     *
     * @param v - New value or a callback to compute the new value based on current state.
     */
    readonly set = (v: T | TSetterCallback<T>) => {
        let tempVal: T;

        if (typeof v === 'function') {
            let params = { value: deepClone(this._value) };
            (v as TSetterCallback<T>)(params); // Determine new value.
            tempVal = params.value;
        } else {
            tempVal = v; // Determine new value.
        }

        // Check if the new value is different and meets update conditions before updating.
        if (!deepCompare(this.value, tempVal) && (!this._conditionUpdating || this._conditionUpdating(this.value, tempVal))) {
            this._forceUpdate(tempVal); // Perform forced update if conditions are satisfied.
        }
    };

    /**
     * Stops rendering updates for this instance.
     */
    readonly stop = () => {
        this._isRender = false; // Disable rendering updates.
    };

    /**
     * Resumes rendering updates for this instance.
     */
    readonly resume = () => {
        this._isRender = true; // Enable rendering updates.
        this._inform(); // Notify listeners of any current value changes.
    };

    /**
     * Resets the state back to its initial value.
     */
    readonly reset = () => {
        this._forceUpdate(deepClone(this._initialValue)); // Reset to initial value.
    };

    /**
     * Sets a condition for updating the state. The callback receives previous and new values and returns a boolean indicating whether to update.
     *
     * @param cb - Callback function for determining update conditions.
     */
    readonly conditionUpdating = (cb: TConditionUpdating<T>) => (this._conditionUpdating = cb);

    /**
     * Sets a condition for rendering. The callback receives the current value and returns a boolean indicating whether to render.
     *
     * @param cb - Callback function for determining render conditions.
     */
    readonly conditionRendering = (cb: TConditionRendering<T>) => (this._conditionRendering = cb);

    /**
     * Function to use the current value in components. This provides reactivity to component updates based on state changes.
     */
    readonly use = useCore(this._listeners, () => this.value);

    /**
     * Function to watch changes on state and notify listeners accordingly.
     */
    readonly watch = watchCore(this._listeners);

    /**
     * Generates HTML output from the use function to render dynamic content based on current state.
     */
    readonly html = htmlCore(this.use);

    /**
     * A wrapper component that allows for rendering based on current state while managing reactivity efficiently.
     */
    readonly Wrap = WrapCore(this.use);

    /**
     * A hard wrapper component that provides additional control over rendering and avoids unnecessary re-renders in parent components.
     */
    readonly HardWrap = HardWrapCore(this.use);

    /**
     * Creates a sliced version of the state by applying a function to derive a part of the current value.
     *
     * @param pick - Function that extracts a portion of the current value.
     */
    readonly slice = <P>(pick: (v: T) => P) => {
        let _value: Readonly<P> = pick(this.value); // Extracted portion of the current state.
        let _isRender = true; // Flag to manage rendering for sliced values.
        let _conditionRendering: TConditionRendering<P> | undefined; // Condition for rendering sliced values.
        const listeners: TListeners<P> = new Set(); // Listeners for sliced values.

        const _inform = () => {
            const temp = pick(this.value); // Get new extracted portion of the state.
            if (_isRender && (!_conditionRendering || _conditionRendering(temp))) {
                _value = temp; // Update sliced value if conditions are met.
                listeners.forEach(listener => listener(temp)); // Notify listeners of sliced value change.
            }
        };

        // Add a listener to inform when the original state changes affecting the sliced output.
        this._listeners.add(() => {
            if (!deepCompare(pick(this.value), _value)) {
                _inform(); // Trigger inform if sliced output has changed due to original state change.
            }
        });

        const use = useCore(listeners, () => _value); // Core function for reactivity with sliced values.

        const control = {
            value: _value,
            use,
            watch: watchCore(listeners), // Watch changes for sliced values.
            html: htmlCore(use), // Generate HTML output for sliced values.
            Wrap: WrapCore(use), // Wrapper component for sliced values with reactivity.
            HardWrap: HardWrapCore(use), // Hard wrapper component for more control over rendering of sliced values.
            stop: () => (_isRender = false), // Stop rendering updates for sliced values.
            resume: () => {
                _isRender = true; // Resume rendering updates for sliced values.
                _inform(); // Inform listeners about any changes after resuming.
            },
            conditionRendering: (cb: TConditionRendering<P>) => (_conditionRendering = cb) // Set condition for rendering sliced values.
        };

        Object.defineProperty(control, 'value', {
            get: () => _value, // Getter for accessing sliced value directly.
            enumerable: false,
            configurable: false
        });

        return control as Readonly<TOmitHtml<P, typeof control>>; // Return control object without HTML methods exposed directly.
    };
}

/**
 * ReactSignify
 * -
 * @link https://reactsignify.dev
 * @description
 * Factory function to create a new Signify instance with an initial value and optional configuration settings.
 *
 * @template T - Type of the initial state value.
 * @param initialValue - The initial value to start with in Signify instance.
 * @param config - Optional configuration settings for Signify instance behavior.
 *
 * @returns A new instance of Signify configured with provided initial settings.
 */
export const signify = <T>(initialValue: T, config?: TSignifyConfig): TOmitHtml<T, Signify<T>> => new Signify(initialValue, config);
