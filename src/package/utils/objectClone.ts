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

/**
 * Deep clone any JavaScript object with support for circular references and custom constructors
 * @param source The object to be cloned
 * @param options Optional configuration
 * @returns A deep clone of the source object
 */
export const deepClone = <T>(
    source: T,
    options?: {
        constructorHandlers?: [Function, (obj: any, clone: (o: any) => any) => any][]
    }
): T => {
    // Handle primitives, null, and undefined directly
    if (typeof source !== 'object' || source === null) {
        return source;
    }

    // Create a WeakMap to track already cloned objects (for circular references)
    const cloneMap = new WeakMap();

    // Map to hold custom constructors and their cloning functions
    const constructorHandlers = new Map();
    
    // Add default handlers for common built-in objects
    constructorHandlers.set(Date, (obj: Date) => new Date(obj));
    constructorHandlers.set(Map, (obj: Map<any, any>, fn: (o: any) => any) => 
        new Map(Array.from(obj.entries()).map(([key, val]) => [fn(key), fn(val)])));
    constructorHandlers.set(Set, (obj: Set<any>, fn: (o: any) => any) => 
        new Set(Array.from(obj).map(val => fn(val))));
    constructorHandlers.set(RegExp, (obj: RegExp) => new RegExp(obj.source, obj.flags));
    constructorHandlers.set(Error, (obj: Error, fn: (o: any) => any) => {
        const error = new Error(obj.message);
        if (obj.stack) error.stack = obj.stack;
        if (obj.cause) error.cause = fn(obj.cause);
        return error;
    });
    constructorHandlers.set(URL, (obj: URL) => new URL(obj.toString()));
    constructorHandlers.set(Blob, (obj: Blob) => obj.slice(0, obj.size, obj.type));
    constructorHandlers.set(File, (obj: File) => new File([obj.slice(0, obj.size)], obj.name, { 
        type: obj.type, 
        lastModified: obj.lastModified 
    }));
    constructorHandlers.set(FileList, (obj: FileList, fn: (o: any) => any) => {
        // FileList can't be directly constructed, so we clone each File
        const files = Array.from(obj).map(file => fn(file));
        // Return the array of files since we can't create a proper FileList
        return Object.defineProperty(files, 'item', {
            value: (index: number) => files[index],
            enumerable: false
        });
    });
    
    // If additional constructor handlers are provided in options, add them to the map
    if (options?.constructorHandlers) {
        for (const handler of options.constructorHandlers) {
            constructorHandlers.set(handler[0], handler[1]);
        }
    }

    // The main clone function
    const clone = (obj: any): any => {
        // Handle primitives, null, and undefined directly
        if (typeof obj !== 'object' || obj === null) {
            return obj;
        }
        
        // Check if this object has already been cloned (circular reference)
        if (cloneMap.has(obj)) {
            return cloneMap.get(obj);
        }
        
        // Handle arrays
        if (Array.isArray(obj)) {
            const result: any[] = [];
            cloneMap.set(obj, result);
            
            for (let i = 0; i < obj.length; i++) {
                result[i] = clone(obj[i]);
            }
            
            return result;
        }
        
        // Handle ArrayBuffer views
        if (ArrayBuffer.isView(obj)) {
            return copyBuffer(obj);
        }
        
        // Handle custom constructor objects
        if (obj.constructor !== Object && constructorHandlers.has(obj.constructor)) {
            const result = constructorHandlers.get(obj.constructor)(obj, clone);
            if (typeof result === 'object' && result !== null) {
                cloneMap.set(obj, result);
            }
            return result;
        }
        
        // Create a new instance with the same prototype for regular objects
        const result = Object.create(Object.getPrototypeOf(obj));
        cloneMap.set(obj, result);
        
        // Copy all enumerable properties
        for (const key of Object.keys(obj)) {
            result[key] = clone(obj[key]);
        }
        
        // Copy non-enumerable properties that are directly on the object
        for (const key of Object.getOwnPropertyNames(obj)) {
            if (!Object.prototype.propertyIsEnumerable.call(obj, key)) {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key);
                if (descriptor) {
                    if (descriptor.value !== undefined) {
                        descriptor.value = clone(descriptor.value);
                    }
                    Object.defineProperty(result, key, descriptor);
                }
            }
        }
        
        // Copy symbol properties
        for (const sym of Object.getOwnPropertySymbols(obj)) {
            const descriptor = Object.getOwnPropertyDescriptor(obj, sym);
            if (descriptor) {
                if (descriptor.value !== undefined) {
                    descriptor.value = clone(descriptor.value);
                }
                Object.defineProperty(result, sym, descriptor);
            }
        }
        
        return result;
    };

    return clone(source);
};
