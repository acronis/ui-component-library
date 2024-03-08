import {
  getMonacoAssets
} from 'packages/script-editor/utils';

let loaderPending = false;
let loaderCallbacks = [];

function onAmdLoaderLoad() {
  let currentCallback = loaderCallbacks.shift();
  while (currentCallback) {
    window.clearTimeout(currentCallback.timeout);
    currentCallback.resolve();
    currentCallback = loaderCallbacks.shift();
  }
}

function onAmdLoaderError(err) {
  let currentCallback = loaderCallbacks.shift();
  while (currentCallback) {
    window.clearTimeout(currentCallback.timeout);
    currentCallback.reject(err);
    currentCallback = loaderCallbacks.shift();
  }
}

export default {
  reset() {
    loaderPending = false;
    loaderCallbacks = [];
  },
  ensureMonacoIsLoaded(assetsPath) {
    const {
      srcPath,
      vsPath,
      loader: loaderUrl,
      worker
    } = getMonacoAssets(assetsPath);

    return new Promise((resolve, reject) => {
      if (window.monaco) {
        resolve();
        return;
      }
      const config = {
        paths: {
          vs: vsPath
        }
      };

      const timeout = window.setTimeout(() => {
        reject(new Error("Couldn't load monaco editor after 60s"));
      }, 60000);

      loaderCallbacks.push({
        resolve: () => {
          if (loaderPending) {
            window.require.config(config);
            loaderPending = false;
          }

          const proxy = URL.createObjectURL(
            new Blob([
              `
                self.MonacoEnvironment = {
                  baseUrl: '${srcPath}/'
                };
                importScripts('${worker}');
              `
            ], { type: 'text/javascript' })
          );

          window.MonacoEnvironment = { getWorkerUrl: () => proxy };

          window.require(['vs/editor/editor.main'], resolve);
        },
        timeout,
        reject
      });

      if (!loaderPending) {
        if (window.require) {
          onAmdLoaderLoad();
        } else {
          const loaderScript = window.document.createElement('script');
          loaderScript.type = 'text/javascript';
          loaderScript.src = loaderUrl;
          loaderScript.addEventListener('load', onAmdLoaderLoad);
          loaderScript.addEventListener('error', onAmdLoaderError);
          window.document.body.appendChild(loaderScript);
          loaderPending = true;
        }
      }
    });
  }
};
