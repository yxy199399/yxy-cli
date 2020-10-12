const { promisify } = require("util");
const fs = require('fs');

// 模板编辑，可修改package.json 文件内容，这里用于修改项目名称
const handlebars = require("handlebars");
module.exports.clone = async function(repo, desc) {
  // 下载模板
  const download = promisify(require("download-git-repo"));
  // 下载动画显示
  const ora = require("ora");
  const course = ora(`下载……${repo}`);
  
  course.start();
  await download(repo, desc, { clone: true });
  course.succeed();
  console.log("修改名称")
  const fileName = `${desc}/package.json`;
  const meta = {
    name: desc
   };
   if(fs.existsSync(fileName)){
    const content = fs.readFileSync(fileName).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(fileName, result);
  }
} 