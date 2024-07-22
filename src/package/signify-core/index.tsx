import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { HardWrapCore, htmlCore, useCore, watchCore, WrapCore } from './signify.core';
import { TConditionRendering, TConditionUpdate as TConditionUpdating, TListeners, TOmitHtml, TSetterCallback, TSignifyConfig, TUseValueCb } from './signify.model';

class Signify<T = unknown> {
    private _isRender = true;
    private _initialValue: T;
    private _value: T;
    private _config?: TSignifyConfig;
    private _listeners: TListeners<T> = new Set();
    private _syncSetter?: TUseValueCb<T>;
    private _conditionUpdating?: TConditionUpdating<T>;
    private _conditionRendering?: TConditionRendering<T>;

    constructor(initialValue: T, config?: TSignifyConfig) {
        this._initialValue = JSON.parse(JSON.stringify(initialValue));
        this._value = getInitialValue(initialValue, config?.cache);
        this._config = config;

        if (config?.syncKey) {
            const { post, sync } = syncSystem<T>({
                key: config.syncKey,
                cb: data => {
                    this._value = data;
                    cacheUpdateValue(this.value, this._config?.cache);
                    this.inform();
                }
            });

            this._syncSetter = post;

            sync(() => this.value);
        }
    }

    private inform = () => {
        if (this._isRender && (!this._conditionRendering || this._conditionRendering(this.value))) {
            this._listeners.forEach(listener => listener(this.value));
        }
    };

    private forceUpdate = (value: T) => {
        this._value = value;
        cacheUpdateValue(this.value, this._config?.cache);
        this._syncSetter?.(this.value);
        this.inform();
    };

    get value(): Readonly<T> {
        return this._value;
    }

    readonly set = (v: T | TSetterCallback<T>) => {
        let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

        if (!Object.is(this.value, tempVal) && (!this._conditionUpdating || this._conditionUpdating(this.value, tempVal))) {
            this.forceUpdate(tempVal);
        }
    };

    readonly stop = () => {
        this._isRender = false;
    };
    readonly resume = () => {
        this._isRender = true;
        this.inform();
    };

    readonly reset = () => {
        this.forceUpdate(JSON.parse(JSON.stringify(this._initialValue)));
    };

    readonly conditionUpdating = (cb: TConditionUpdating<T>) => (this._conditionUpdating = cb);
    readonly conditionRendering = (cb: TConditionRendering<T>) => (this._conditionRendering = cb);
    readonly use = useCore(this._listeners, () => this.value);
    readonly watch = watchCore(this._listeners);
    readonly html = htmlCore(this.use);
    readonly Wrap = WrapCore(this.use);
    readonly HardWrap = HardWrapCore(this.use);
    readonly slice = <P,>(pick: (v: T) => P) => {
        let value: Readonly<P> = pick(this.value);
        let isRender = true;
        let conditionRendering: TConditionRendering<P> | undefined;
        const listeners: TListeners<P> = new Set();
        const inform = () => {
            const temp = pick(this.value);
            if (isRender && (!conditionRendering || conditionRendering(temp))) {
                value = temp;
                listeners.forEach(listener => listener(temp));
            }
        };

        this._listeners.add(() => {
            if (!Object.is(pick(this.value), value)) {
                inform();
            }
        });

        const use = useCore(listeners, () => value);
        const control = {
            value,
            use,
            watch: watchCore(listeners),
            html: htmlCore(use),
            Wrap: WrapCore(use),
            HardWrap: HardWrapCore(use),
            stop: () => (isRender = false),
            resume: () => {
                isRender = true;
                inform();
            },
            conditionRendering: (cb: TConditionRendering<P>) => (conditionRendering = cb)
        };

        Object.defineProperty(control, 'value', {
            get: () => value,
            enumerable: false,
            configurable: false
        });

        return control as Readonly<TOmitHtml<P, typeof control>>;
    };
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig): TOmitHtml<T, Signify<T>> => new Signify(initialValue, config);
