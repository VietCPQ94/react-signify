export const syncSystem = <T>({ key, cb }: { key?: string; cb(val: T): void }) => {
  if (key) {
    const bc = new BroadcastChannel(`bc_${key}`);

    bc.onmessage = e => cb(JSON.parse(e.data));

    return (data: T) => {
      bc.postMessage(JSON.stringify(data));
    };
  }
};
