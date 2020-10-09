const { promisify } = require("util");
module.exports.clone = async function(repo, desc) {
  const download = promisify(require("download-git-repo"));
  const ora = require("ora");
  const course = ora(`下载……${repo}`);
  
  course.start();
  await download(repo, desc);
  course.succeed();
} 