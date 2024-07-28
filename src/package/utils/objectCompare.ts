// Function to check if two values are equal
export const equal = (a: any, b: any) => {
    // If both values are strictly equal, return true
    if (a === b) return true;

    // Check if both values are objects
    if (a && b && typeof a == 'object' && typeof b == 'object') {
        // If the constructors of both objects are different, return false
        if (a.constructor !== b.constructor) return false;

        var length, i, keys;

        // Check if both values are arrays
        if (Array.isArray(a)) {
            length = a.length;
            // If the lengths of the arrays are different, return false
            if (length != b.length) return false;
            // Recursively check each element in the arrays
            for (i = length; i-- !== 0; ) if (!equal(a[i], b[i])) return false;
            return true;
        }

        // Check for RegExp equality
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;

        // Check for valueOf method equality
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();

        // Check for toString method equality
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();

        // Get the keys of the first object
        keys = Object.keys(a);
        length = keys.length;
        // If the number of keys in both objects is different, return false
        if (length !== Object.keys(b).length) return false;

        // Check that all keys in the first object exist in the second object
        for (i = length; i-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

        // Recursively check each key-value pair for equality
        for (i = length; i-- !== 0; ) {
            var key = keys[i];
            if (!equal(a[key], b[key])) return false;
        }

        return true; // All checks passed, the objects are equal
    }

    // Check for NaN equality (both values are NaN)
    return a !== a && b !== b;
};
