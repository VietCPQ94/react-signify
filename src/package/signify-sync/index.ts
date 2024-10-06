/**
 * Creates a synchronization system using BroadcastChannel.
 * This function allows you to establish communication between different browser contexts by sending messages
 * and synchronizing state changes.
 *
 * @template T - The type of data to be synchronized.
 * @param {Object} params - The parameters for the syncSystem function.
 * @param {string} params.key - A unique identifier for the broadcast channel.
 * @param {function} params.cb - A callback function that will be invoked
 *                                whenever a new message is received.
 * @returns
 *    - An object containing the following methods:
 *    - post(data: T): Sends the provided data to the BroadcastChannel.
 *    - sync(getData: () => T): Synchronizes the current data with other contexts by posting the data when
 *      a message is received on a global BroadcastChannel.
 */
export const syncSystem = <T>({ key, cb }: { key: string; cb(val: T): void }) => {
    const mainKey = `bc_${key}`,
        bc = new BroadcastChannel(mainKey);

    bc.onmessage = e => cb(e.data);

    return {
        post: (data: T) => {
            bc.postMessage(data);
        },
        sync: (getData: () => T) => {
            const bcs = new BroadcastChannel(`bcs`);
            bcs.onmessage = e => mainKey === e.data && bc.postMessage(getData());
            bcs.postMessage(mainKey);
        }
    };
};
