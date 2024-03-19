import { useEffect, useState } from 'react';

export const useWorker = <T>(
  workerCode: () => void,
  handlers: Record<string, (msg: T) => void>
): Worker | undefined => {
  const [worker, setWorker] = useState<Worker>();

  useEffect(() => {
    const code = workerCode.toString().slice(7, -1); // slice to remove () => { and }
    const blob = new Blob([code], { type: 'application/javascript' });
    const blobURL = URL.createObjectURL(blob);
    const worker = new Worker(blobURL);
    setWorker(worker);

    worker.addEventListener('message', (ev) => {
      handlers[ev.data?.type]?.(ev.data);
    });

    return () => {
      worker.terminate();
      URL.revokeObjectURL(blobURL);
    };
  }, []);

  return worker;
};
