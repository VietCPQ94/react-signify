import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { HardWrapCore, htmlCore, useCore, watchCore, WrapCore } from './signify.core';
import { TSetterCallback, TSignifyConfig } from './signify.model';

class Signify<T = unknown> {
    private _isRender = true;
    private _initialValue: T;
    private _value: T;
    private _config?: TSignifyConfig;
    private listeners = new Set<(newValue: T) => void>();
    private syncSetter?(data: T): void;

    constructor(initialValue: T, config?: TSignifyConfig) {
        this._initialValue = initialValue;
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

            this.syncSetter = post;

            sync(() => this.value);
        }
    }

    private inform() {
        if (this._isRender) {
            this.listeners.forEach(listener => listener(this.value));
        }
    }

    private fireUpdate() {
        cacheUpdateValue(this.value, this._config?.cache);
        this.syncSetter?.(this.value);
        this.inform();
    }

    get value() {
        return this._value as Readonly<T>;
    }

    set(v: T | TSetterCallback<T>) {
        let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

        if (!Object.is(this.value, tempVal)) {
            this._value = tempVal;
            this.fireUpdate();
        }
    }

    update(cb: (value: T) => void) {
        cb(this._value);
        this.fireUpdate();
    }

    stop() {
        this._isRender = false;
    }

    resume() {
        this._isRender = true;
        this.inform();
    }

    use = useCore(this.listeners, () => this.value);
    watch = watchCore(this.listeners);
    html = htmlCore(this.use);
    Wrap = WrapCore(this.use);
    HardWrap = HardWrapCore(this.use);

    reset() {
        this.set(this._initialValue);
    }

    slice<P>(pick: (v: T) => P) {
        let value: Readonly<P> = pick(this.value);
        const listeners = new Set<(newValue: P) => void>();

        this.listeners.add(v => {
            if (!Object.is(pick(v), value)) {
                value = pick(v);
                listeners.forEach(listener => listener(value));
            }
        });

        const use = useCore(listeners, () => value);
        const html = htmlCore(use);
        const Wrap = WrapCore(use);
        const HardWrap = HardWrapCore(use);

        return { value, use, html, Wrap, HardWrap };
    }
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig) => new Signify(initialValue, config);
