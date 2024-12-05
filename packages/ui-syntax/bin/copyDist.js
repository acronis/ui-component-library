import fsExtra from "fs-extra";

/**
 * Action that copies the "./dist" directory to the
 * "buildPath" of the platform.
 */
export default {
  name: 'copy_dist',
  do: (dictionary, config) => {
    console.log(`Copying dist directory to ${config.buildPath}dist`);
    fsExtra.copySync('dist', `${config.buildPath}dist`);
  },
  undo: (dictionary, config) => {
    console.log(`Removing dist directory from ${config.buildPath}dist`);
    fsExtra.removeSync(`${config.buildPath}dist`);
  }
}
