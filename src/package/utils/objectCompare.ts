export const deepCompare = (a: any, b: any): boolean => {
    if (a === b) return true;
    if (!a || !b || typeof a !== 'object' || typeof b !== 'object') return a !== a && b !== b; // NaN check

    if (a.constructor !== b.constructor) return false;

    // Array comparison
    if (Array.isArray(a)) {
        if (a.length !== b.length) return false;
        for (let i = a.length; i--; ) if (!deepCompare(a[i], b[i])) return false;
        return true;
    }

    // Special object types
    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

    // Object comparison
    const keys = Object.keys(a);
    if (keys.length !== Object.keys(b).length) return false;

    return keys.every(key => Object.prototype.hasOwnProperty.call(b, key) && deepCompare(a[key], b[key]));
};
