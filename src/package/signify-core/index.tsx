import { syncSystem } from '../signify-sync';
import { cacheUpdateValue, getInitialValue } from '../singify-cache';
import { conditionRenderCore, HardWrapCore, htmlCore, useCore, watchCore, WrapCore } from './signify.core';
import { TconditionRender, TConditionUpdate, TListeners, TOmitHtml, TSetterCallback, TSignifyConfig, TUseValueCb } from './signify.model';

class Signify<T = unknown> {
    private _isRender = true;
    private _initialValue: T;
    private _value: T;
    private _config?: TSignifyConfig;
    private _listeners: TListeners<T> = new Set();
    private _syncSetter!: TUseValueCb<T>;
    private _conditionUpdate?: TConditionUpdate<T>;
    private _conditionRender?: TconditionRender<T>;

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

            this._syncSetter = post;

            sync(() => this.value);
        }
    }

    private inform = () => {
        if (this._isRender && (!this._conditionRender || this._conditionRender(this.value))) {
            this._listeners.forEach(listener => listener(this.value));
        }
    };

    get value(): Readonly<T> {
        return this._value;
    }

    readonly set = (v: T | TSetterCallback<T>) => {
        let tempVal = typeof v === 'function' ? (v as TSetterCallback<T>)(this.value) : v;

        if (!Object.is(this.value, tempVal) && (!this._conditionUpdate || this._conditionUpdate(this.value, tempVal))) {
            this._value = tempVal;
            cacheUpdateValue(this.value, this._config?.cache);
            this._syncSetter(this.value);
            this.inform();
        }
    };

    readonly stop = () => (this._isRender = false);
    readonly resume = () => {
        this._isRender = true;
        this.inform();
    };

    readonly conditionUpdate = (cb: TConditionUpdate<T>) => (this._conditionUpdate = cb);
    readonly conditionRender = (cb: TconditionRender<T>) => (this._conditionRender = cb);
    readonly reset = () => this.set(this._initialValue);
    readonly use = useCore(this._listeners, () => this.value);
    readonly watch = watchCore(this._listeners);
    readonly html = htmlCore(this.use);
    readonly Wrap = WrapCore(this.use);
    readonly HardWrap = HardWrapCore(this.use);
    readonly slice = <P,>(pick: (v: T) => P) => {
        let value: Readonly<P> = pick(this.value);
        let isRender = true;
        let conditionRender: TconditionRender<P> | undefined;
        const listeners: TListeners<P> = new Set();
        const inform = () => {
            if (isRender && (!conditionRender || conditionRender(value))) {
                listeners.forEach(listener => listener(value));
            }
        };

        this._listeners.add(v => {
            if (!Object.is(pick(v), value)) {
                value = pick(v);
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
            conditionRender: conditionRenderCore(conditionRender)
        };

        return control as Readonly<TOmitHtml<P, typeof control>>;
    };
}

export const signify = <T,>(initialValue: T, config?: TSignifyConfig): TOmitHtml<T, Signify<T>> => new Signify(initialValue, config);
