import Component from "./Component";

export interface ChangeDetectable {
    onChange: (() => void) | null
}

export function isChangeDetectable(object: any): object is ChangeDetectable {
    return 'onChange' in object;
}

export function detectComponentChanges<T extends { new(...args: any[]): {} }>(constructor: T) {
    return class extends constructor implements ChangeDetectable {
        private _inner: Component;

        onChange: (() => void) | null = null;

        constructor(...params: any[]) {
            super();
            this._inner = (new constructor(...params) as Component);

            Object.keys(this._inner).forEach(key => {
                Object.defineProperty(this, key, {
                    get: () => Reflect.get(this._inner, key, this._inner),

                    set: value => {
                        Reflect.set(this._inner, key, value, this._inner);
                        this.onChange?.call(this);
                    }
                });
            });
        }
    }
}