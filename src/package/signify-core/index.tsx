import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { HardWrapCore, htmlCore, useCore, watchCore, WrapCore } from './signify.core';
import { TListeners, TOmitHtml, TSetterCallback, TSignifyConfig, TUseValueCb } from './signify.model';

class Signify<T = unknown> {
    private _isRender = true;
    private _initialValue: T;
    private _value: T;
    private _config?: TSignifyConfig;
    private listeners: TListeners<T> = new Set();
    private syncSetter!: TUseValueCb<T>;

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
        this.syncSetter(this.value);
        this.inform();
    }

    get value(): Readonly<T> {
        return this._value;
    }

    set(v: T | TSetterCallback<T>) {
        let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

        if (!Object.is(this.value, tempVal)) {
            this._value = tempVal;
            this.fireUpdate();
        }
    }

    stop() {
        this._isRender = false;
    }

    resume() {
        this._isRender = true;
        this.inform();
    }

    reset() {
        this.set(this._initialValue);
    }

    use = useCore(this.listeners, () => this.value);
    watch = watchCore(this.listeners);
    html = htmlCore(this.use);
    Wrap = WrapCore(this.use);
    HardWrap = HardWrapCore(this.use);

    slice<P>(pick: (v: T) => P) {
        let value: Readonly<P> = pick(this.value);
        const listeners: TListeners<P> = new Set();

        this.listeners.add(v => {
            if (!Object.is(pick(v), value)) {
                value = pick(v);
                listeners.forEach(listener => listener(value));
            }
        });

        const use = useCore(listeners, () => value);
        const control = { value, use, watch: watchCore(listeners), html: htmlCore(use), Wrap: WrapCore(use), HardWrap: HardWrapCore(use) };

        return control as TOmitHtml<P, typeof control>;
    }
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig): TOmitHtml<T, Signify<T>> => new Signify(initialValue, config);
