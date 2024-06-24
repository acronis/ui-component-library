// const version = '${version}';
// const process = require('node:process');

// const packageName = process.env.npm_package_name;
// const scope = packageName.split('/')[1];

module.exports = {
  plugins: {
    '@release-it/conventional-changelog': {
      path: '.',
      infile: 'CHANGELOG.md',
      preset: 'conventionalcommits',
      ignoreRecommendedBump: true
      // gitRawCommitsOpts: {
      //     path: '.',
      // },
    },
  },
  git: false,
  // git: {
  //     push: false,
  //     tagName: `${packageName}-v${version}`,
  //     // pushRepo: 'git@github.com/acronis/ui-component-library.git',
  //     commitsPath: '.',
  //     commitMessage: `feat(${scope}): released version v${version} [no ci]`,
  //     requireCommits: true,
  //     requireCommitsFail: false,
  //     requireCleanWorkingDir: false
  // },
  // npm: false,
  npm: {
    publish: false,
    // ignoreVersion: true,
    versionArgs: ['--workspaces false'],
  },
  // github: false,
  github: {
    draft: true,
    // release: true,
    // releaseName: `${packageName}-v${version}`,
  },
  hooks: {
    'before:git:release': [
      'git add --all',
    ],
    // 'before:init': ['npm run build'],
    // 'after:release': 'echo 🎉 Successfully released ${name} v${version} to ${repo.repository}.'
  }
};
