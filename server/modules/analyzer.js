const fs = require("fs");
const sloc = require("sloc");
const recursive = require("recursive-readdir");

const getFiles = async dir => {
  if (!dir) {
    throw new Error("Directory must be provided");
  }
  try {
    const files = await recursive(dir);
    return files;
  } catch (error) {
    throw new Error(`Error getting files in folder ${dir}`, error);
  }
};
const getComponents = async componentsFolderPath => {
  try {
    const files = await recursive(componentsFolderPath);
    return files.length;
  } catch (error) {
    throw new Error(
      `Error getting files in folder ${componentsFolderPath}`,
      error
    );
  }
};

const readFile = filePath =>
  new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) reject(err);
      else {
        resolve(sloc(data, "js"));
      }
    });
  }).catch(e => {
    throw new Error("Something is wrong in reading file ", filePath);
  });

function sumObjectsByKey() {
  return Array.from(arguments).reduce((a, b) => {
    for (let k in b) {
      if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
    }
    return a;
  }, {});
}

const totalize = async filesStats => {
  try {
    const total = await sumObjectsByKey(...filesStats);
    return total;
  } catch (error) {
    throw new Error("Something went wrong in summing stats ", error);
  }
};

const analyzeFolder = async (folder, extensions) => {
  let oneFolderStats = [];

  for (let i = 0; i < extensions.length; i += 1) {
    try {
      let files = await getFiles(folder);
      let filteredFiles = files
        .filter(file => !file.includes("test"))
        .filter(file => file.includes(extensions[i]));
      const fileAnalysis = filteredFiles.map(file => {
        return readFile(file).then(data => data);
      });

      const filesStats = await Promise.all(fileAnalysis);
      const extensionStats = await totalize(filesStats);
      oneFolderStats = [
        ...oneFolderStats,
        { extension: extensions[i], extensionStats }
      ];
    } catch (error) {
      console.log(error);
    }
  }
  return oneFolderStats;
};

const analyzeProject = async options => {
  let result = [];
  const numberOfComponents = await getComponents(options.componentsFolderPath);
  result = [...result, { numberOfComponents }];

  const keys = Object.keys(options.stats);
  for (let i = 0; i < keys.length; i += 1) {
    const folder = options.stats[keys[i]].path;
    await analyzeFolder(
      options.stats[keys[i]].path,
      options.stats[keys[i]].extensions
    )
      .then(res => {
        result.push({ folder, stats: res });
      })
      .catch(e => console.log(e));
  }
  const globalStats = JSON.stringify(result, null, 2);
  return globalStats;
};

module.exports = { analyzeProject };
