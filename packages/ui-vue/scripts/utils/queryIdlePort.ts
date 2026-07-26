import { createServer } from 'node:net';

export function queryIdlePort(startPort: number, host = 'localhost', maxTry = 20) {
  const server = createServer();

  return new Promise<number>((res, reject) => {
    let onError: (error: Error & { code?: string }) => void;

    const close = () => {
      server.off('error', onError);
      server.close();
    };

    onError = (error: Error & { code?: string }) => {
      if (error.code === 'EADDRINUSE') {
        if (maxTry-- <= 0) {
          close();
        }

        server.listen(++startPort, host);
      }
      else {
        close();
        reject(error);
      }
    };

    server.on('error', onError);
    server.listen(startPort, host, () => {
      close();
      res(startPort);
    });
  });
}
