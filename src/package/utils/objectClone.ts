/**
 * Deep clone any JavaScript object with support for circular references and custom constructors
 * @param source The object to be cloned
 * @param options Optional configuration
 * @returns A deep clone of the source object
 */
export const deepClone = <T>(
    source: T,
    options?: {
        constructorHandlers?: [Function, (obj: any, fn?: (o: any) => any) => any][];
    }
): T => {
    // Handle primitives, null, and undefined directly
    if (typeof source !== 'object' || source === null) {
        return source;
    }

    // Create a WeakMap to track already cloned objects (for circular references)
    const cloneMap = new WeakMap();

    // Built-in object handlers
    const handlers = new Map<Function, (obj: any, fn?: (o: any) => any) => any>([
        [Date, (obj: Date) => new Date(obj.getTime())],
        [RegExp, (obj: RegExp) => new RegExp(obj.source, obj.flags)],
        [Map, (obj: Map<any, any>, fn?: (o: any) => any) => new Map([...obj].map(([k, v]) => [fn!(k), fn!(v)]))],
        [Set, (obj: Set<any>, fn?: (o: any) => any) => new Set([...obj].map(fn!))],
        [Error, (obj: Error, fn?: (o: any) => any) => Object.assign(new (obj.constructor as any)(obj.message), { stack: obj.stack, cause: obj.cause && fn!(obj.cause) })],
        [URL, (obj: URL) => new URL(obj.href)],
        [Blob, (obj: Blob) => obj.slice()],
        [File, (obj: File) => new File([obj], obj.name, { type: obj.type, lastModified: obj.lastModified })],
        ...(options?.constructorHandlers || [])
    ]);

    // Main clone function
    const clone = (obj: any): any => {
        // Handle primitives
        if (typeof obj !== 'object' || obj === null) return obj;

        // Handle circular references
        if (cloneMap.has(obj)) return cloneMap.get(obj);

        let result: any;

        // Handle different object types
        if (Array.isArray(obj)) {
            result = obj.map(clone);
        } else if (ArrayBuffer.isView(obj)) {
            result = obj instanceof Buffer ? Buffer.from(obj) : new (obj.constructor as any)(obj.buffer.slice(), obj.byteOffset, (obj as any).length);
        } else if (handlers.has(obj.constructor)) {
            result = handlers.get(obj.constructor)!(obj, clone);
        } else {
            // Handle plain objects
            result = Object.create(Object.getPrototypeOf(obj));
            cloneMap.set(obj, result);

            // Copy all properties in one pass
            [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].forEach(key => {
                const descriptor = Object.getOwnPropertyDescriptor(obj, key)!;
                if (descriptor.value !== undefined) descriptor.value = clone(descriptor.value);
                Object.defineProperty(result, key, descriptor);
            });
            return result;
        }

        cloneMap.set(obj, result);
        return result;
    };

    return clone(source);
};
