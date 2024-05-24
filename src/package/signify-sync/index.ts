export const syncSystem = <T>({ key, cb }: { key: string; cb(val: T): void }) => {
  const mainKey = `bc_${key}`;
  const bc = new BroadcastChannel(mainKey);

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
