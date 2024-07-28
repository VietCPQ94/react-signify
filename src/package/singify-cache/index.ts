import { TCacheConfig, TCacheSolution } from './cache.model';

// Define a cache solution object that maps cache types to their respective storage mechanisms
const cacheSolution: TCacheSolution = {
    LocalStorage: localStorage, // Using the localStorage API for persistent storage
    SesionStorage: sessionStorage // Using the sessionStorage API for temporary storage
};

/**
 * Retrieves the initial value from either LocalStorage or SessionStorage based on the provided cache configuration.
 * If the value is not found in the specified storage, it sets the initial value in the storage.
 *
 * @param initialValue - The initial value to be stored if no cached value exists.
 * @param cacheInfo - An optional configuration object that includes:
 *                    - key: The key under which the value is stored in the cache.
 *                    - type: The type of storage to use ('LocalStorage' or 'SesionStorage').
 * @returns The retrieved value from cache or the initial value if no cached value exists.
 */
export const getInitialValue = <T>(initialValue: T, cacheInfo?: TCacheConfig): T => {
    if (cacheInfo?.key) {
        const mainType = cacheInfo?.type ?? 'LocalStorage'; // Default to LocalStorage if no type is provided
        const tempValue = cacheSolution[mainType].getItem(cacheInfo.key); // Retrieve item from storage

        if (tempValue) {
            return JSON.parse(tempValue); // Return parsed value if found in storage
        }

        // Set initial value in storage if not found
        cacheSolution[mainType].setItem(cacheInfo.key, JSON.stringify(initialValue));
    }

    return initialValue; // Return a deep copy of the initial value
};

/**
 * Updates the stored value in the specified cache configuration.
 * If the key is provided in cacheInfo, it updates the corresponding storage with the new value.
 *
 * @param newValue - The new value to be stored in the cache.
 * @param cacheInfo - An optional configuration object that includes:
 *                    - key: The key under which the new value will be stored.
 *                    - type: The type of storage to use ('LocalStorage' or 'SesionStorage').
 */
export const cacheUpdateValue = <T>(newValue: T, cacheInfo?: TCacheConfig) => {
    if (cacheInfo?.key) {
        // Update item in specified storage
        cacheSolution[cacheInfo?.type ?? 'LocalStorage'].setItem(cacheInfo.key, JSON.stringify(newValue));
    }
};
