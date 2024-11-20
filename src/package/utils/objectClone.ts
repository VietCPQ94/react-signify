// Function to create a copy of a Buffer or ArrayBuffer view
const copyBuffer = (cur: any) => {
    // Check if the current object is an instance of Buffer
    if (cur instanceof Buffer) {
        // Return a new Buffer from the current one
        return Buffer.from(cur);
    }

    // For other ArrayBuffer views, create a new instance using the constructor and provide the buffer slice
    return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length);
};

// Main function to deep clone an object with options
export const deepClone = (opts: any) => {
    if (typeof opts !== 'object' && [null, undefined].includes(opts)) {
        return opts;
    }

    // Map to hold custom constructors and their cloning functions
    const constructorHandlers = new Map();
    // Add a handler for Date objects
    constructorHandlers.set(Date, (o: any) => new Date(o));
    // Add a handler for Map objects
    constructorHandlers.set(Map, (o: any, fn: any) => new Map(cloneArray(Array.from(o), fn)));
    // Add a handler for Set objects
    constructorHandlers.set(Set, (o: any, fn: any) => new Set(cloneArray(Array.from(o), fn)));

    // If additional constructor handlers are provided in options, add them to the map
    if (opts.constructorHandlers) {
        for (const handler of opts.constructorHandlers) {
            constructorHandlers.set(handler[0], handler[1]);
        }
    }

    // Function to clone an array using the cloning function provided
    const cloneArray = (a: any, fn: any) => {
        // Get the keys of the array
        const keys = Object.keys(a);
        // Create a new array to hold cloned values
        const a2 = new Array(keys.length);
        // Iterate over each key in the original array
        for (let i = 0; i < keys.length; i++) {
            const k: any = keys[i];
            const cur = a[k];
            // If the current item is not an object or is null, copy it directly
            if (typeof cur !== 'object' || cur === null) {
                a2[k] = cur;
            }
            // If there's a custom handler for the current object's constructor, use it
            else if (cur.constructor !== Object && constructorHandlers.get(cur.constructor)) {
                a2[k] = constructorHandlers.get(cur.constructor)(cur, fn);
            }
            // If it's an ArrayBuffer view, use copyBuffer to create a copy
            else if (ArrayBuffer.isView(cur)) {
                a2[k] = copyBuffer(cur);
            }
            // Otherwise, recursively clone the item
            else {
                a2[k] = fn(cur);
            }
        }
        return a2;
    };

    // Function to clone an object recursively
    const clone = (o: any) => {
        // If the input is not an object or is null, return it directly
        if (typeof o !== 'object' || o === null) return o;
        // If it's an array, use cloneArray to handle cloning
        if (Array.isArray(o)) return cloneArray(o, clone);
        // If there's a custom handler for the object's constructor, use it
        if (o.constructor !== Object && constructorHandlers.get(o.constructor)) {
            return constructorHandlers.get(o.constructor)(o, clone);
        }
        // Create an empty object to hold cloned properties
        const o2: any = {};
        // Iterate over each property in the original object
        for (const k in o) {
            // Skip properties that are not directly on the object
            if (Object.hasOwnProperty.call(o, k) === false) continue;
            const cur = o[k];
            // If the current property is not an object or is null, copy it directly
            if (typeof cur !== 'object' || cur === null) {
                o2[k] = cur;
            }
            // If there's a custom handler for the current property's constructor, use it
            else if (cur.constructor !== Object && constructorHandlers.get(cur.constructor)) {
                o2[k] = constructorHandlers.get(cur.constructor)(cur, clone);
            }
            // If it's an ArrayBuffer view, use copyBuffer to create a copy
            else if (ArrayBuffer.isView(cur)) {
                o2[k] = copyBuffer(cur);
            }
            // Otherwise, recursively clone the property
            else {
                o2[k] = clone(cur);
            }
        }
        return o2;
    };

    // Start the cloning process with the given options
    return clone(opts);
};
