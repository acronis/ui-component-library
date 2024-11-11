import { existsSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import minimist from 'minimist';
import { format } from 'prettier';
import { prettierConfig, rootDir } from './utils/constant';
import { logger } from './utils/logger';
import { queryIdlePort } from './utils/queryIdlePort';
import { run } from './utils/run';
import { specifyComponent } from './utils/specifyComponent';

const args = minimist<{
  s?: boolean
  sourcemap?: boolean
  p?: string
  port?: string
  prod?: boolean
  l?: string
  lang?: string
  t?: boolean
  theme?: boolean
}>(process.argv.slice(2));

const sourceMap = args.sourcemap || args.s;
const argPort = args.port || args.p || '8008';
const prodMode = args.prod;
// const lang = args.lang || args.l;
const theme = args.theme || args.t;

// const langs = ['zh-CN', 'en-US'];

const devDir = resolve(rootDir, 'dev-server');

let port = Number.parseFloat(argPort) || 8008;

async function main() {
  port = await queryIdlePort(port);

  if (theme) {
    await serveTheme();
  }
  else {
    await serveComponent();
  }
}

async function serveComponent() {
  const demosDir = resolve(rootDir, 'examples/demos');
  const targets = readdirSync(demosDir)
    .filter(f => statSync(resolve(demosDir, f)).isDirectory() && f !== '__data__');

  const target = await specifyComponent(args, targets);

  logger.withBothLn(() => logger.success(`matched target: ${target}`));

  const demos = queryDemos(target);

  const router = `
    import { createRouter, createWebHashHistory } from 'vue-router';

    document.title = '${target} | Acronis UI Component Library';

    export const router = createRouter({
      history: createWebHashHistory('/'),
      routes: [
        ${demos
          .map((demo, index) => {
            return `{
            path: '${index ? `/${demo}` : '/'}',
            name: '${demo}',
            component: () => import('../../examples/demos/${target}/${demo}')
          }`;
          })
          .join(',\n')},
        {
          path: '/${demos.includes('play') ? '_' : ''}play',
          name: 'playground',
          component: () => import('../play.vue')
        },
        {
          path: '/:catchAll(.*)',
          redirect: '/'
        }
      ]
    })

    router.afterEach((to) => {
      document.title = \`${target} - \${typeof to.name === 'string' ? to.name : 'dev'} | Acronis UI Component Library\`;
    });
  `;

  writeFileSync(
    resolve(devDir, 'router', `port-${port}.ts`),
    await format(router, { ...prettierConfig, parser: 'typescript' }),
    'utf-8'
  );

  const playPath = resolve(devDir, 'play.vue');

  if (!existsSync(playPath)) {
    writeFileSync(
      playPath,
      await format(
        `<script setup lang="ts">
        // write something or copy from playground
        </script>
        
        <template>
          <div></div>
        </template>`,
        { ...prettierConfig, parser: 'vue' }
      ),
      'utf-8'
    );
  }

  await run('pnpm', ['serve'], {
    cwd: devDir,
    stdio: 'inherit',
    env: {
      NODE_ENV: prodMode ? 'production' : 'development',
      TARGET: target,
      DEMOS: JSON.stringify(demos),
      PORT: `${port}`,
      SOURCE_MAP: sourceMap ? 'true' : '',
      THEME: theme ? 'true' : ''
    }
  });
}

async function serveTheme() {
  await run('pnpm', ['serve'], {
    cwd: devDir,
    stdio: 'inherit',
    env: {
      NODE_ENV: prodMode ? 'production' : 'development',
      PORT: `${port}`,
      SOURCE_MAP: sourceMap ? 'true' : '',
      THEME: 'true'
    }
  });
}

function queryDemos(target: string) {
  const dir = resolve(rootDir, 'examples/demos', target);

  return readdirSync(dir).filter(
    f => f.endsWith('.vue')
  );
}

main().catch((error) => {
  logger.error(error);
  process.exit(1);
});
