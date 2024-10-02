const { spawn } = require('cross-spawn');
const fs = require('fs');
require('dotenv').config();
const Debugger = require('./debugger');
const Tail = require('tail').Tail;
const path = require('path');

/*
    This script is used to watch for file changes in the project and trigger a build and copy the webpacked file to the Desktop Node runtime folder.
    It also tails the logs for messages containing a keyword specified in the .env file.
    Example Usage:
    - Add the following to your package.json file:
        "scripts": {
            "prod-debug": "node prod-debug.js"
        }
    - Create a .env file in the root of the project with the following content:
        WEBPACKED_FILE_PATH=dist/hello-world.js
        DESTINATION_PATH=/_some_CID_task_file_name_.js
        LOG_PATH=/logs/_some_Task_ID_.log
        KEYWORD=DEBUG
        NODE_DIR=/path/to/node/dir/
    - Run the script using the command: npm run prod-debug
    - Change a file in the project and see the script trigger a build and copy the file to the Desktop Node runtime folder
    - Check the logs from the desktop node that contain your keyword
*/

const startWatching = async () => {
  console.log('Watching for file changes...');
  // watch and trigger builds
  await build();
};

/* build and webpack the task */
const build = async () => {
  console.log('Building...');
  const child = await spawn('npm', ['run', 'webpack:test'], {
    stdio: 'inherit',
  });

  await child.on('close', code => {
    if (code !== 0) {
      console.error('Build failed');
    } else {
      console.log('Build successful');
      copyWebpackedFile();
    }
    return;
  });
};

/* copy the task to the Desktop Node runtime folder */
const copyWebpackedFile = async () => {
  const debugConfig = await Debugger.getConfig();
  console.log('debugConfig', debugConfig);
  const nodeDIR = debugConfig.nodeDir;
  const sourcePath = __dirname + '/' + debugConfig.webpackedFilePath;
  const desktopNodeExecutablePath = nodeDIR + '/' + debugConfig.destinationPath;
  const desktopNodeLogPath = nodeDIR + '/' + debugConfig.logPath;
  const keywords = debugConfig.keywords;
  const taskID = debugConfig.taskID;

  if (!sourcePath || !desktopNodeExecutablePath) {
    console.error('Source path or destination path not specified in .env');
    return;
  }

  console.log(
    `Copying webpacked file from ${sourcePath} to ${desktopNodeExecutablePath}...`,
  );

  fs.copyFile(sourcePath, desktopNodeExecutablePath, async err => {
    if (err) {
      console.error('Error copying file:', err);
    } else {
      console.log('File copied successfully');
      tailLogs(desktopNodeLogPath, keywords, taskID);
    }
  });
};

/* tail logs */
const tailLogs = async (desktopNodeLogPath, keywords, taskID) => {
  console.log('Watchings logs for messages containing ', keywords);

  // Extract the directory path from the full log file path
  const dirPath = path.dirname(desktopNodeLogPath);

  // Check if the directory exists, create it if it doesn't
  try {
    await fs.promises.access(dirPath, fs.constants.F_OK);
  } catch (dirErr) {
    console.log(
      'Unable to find task directory. Please make sure you have the correct task ID set in your .env file, and run the task on the Desktop Node before running prod-debug.',
    );
    process.exit(1);
  }

  // Ensure the log file exists, or create it if it doesn't
  try {
    await fs.promises.access(desktopNodeLogPath, fs.constants.F_OK);
  } catch (err) {
    console.log(`Log file not found, creating ${desktopNodeLogPath}`);
    await fs.promises.writeFile(desktopNodeLogPath, '', { flag: 'a' }); // 'a' flag ensures the file is created if it doesn't exist and not overwritten if it exists
  }

  let tail = new Tail(desktopNodeLogPath, '\n', {}, true);

  console.warn(
    'Now watching logs for messages containing ',
    keywords,
    'Please start the Task',
    taskID,
    ' and keep it running on the Desktop Node.',
  );

  tail.on('line', function (data) {
    console.log(data);
    // if (keywords.some(keyword => data.includes(keyword))) {
    //   console.log(`PROD$ ${data}`);
    // }
  });

  tail.on('error', function (error) {
    console.log('ERROR: ', error);
  });
};

startWatching();
