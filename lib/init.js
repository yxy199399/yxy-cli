const { promisify } = require("util");
const figlet = promisify(require("figlet"));

const clear = require("clear");
const chalk = require("chalk");
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');
const log = content  => console.log(chalk.green(content));
const { clone } = require("./download.js");
// const spawn = async (...args) => {
//   const { spawn } = require("child_process");
//   return new Promise(resolve => {
//     const proc = spawn(...args);
//     proc.stdout.pipe(process.stdout);
//     proc.stderr.pipe(process.stderr);
//     proc.on("close", () => {
//       resolve()
//     })
//   })
// }

module.exports = async name => {
  // 打印欢迎页面
  clear();
  const data = await figlet("YXY");
  log(data);

  // 克隆
  const promptList = [{
    type: 'list',
    message: '请选项目类型:',
    name: 'project-type',
    choices: [
        "pc",
        "phone"
    ],
    filter: function (val) { // 使用filter将回答变为小写
        return val.toLowerCase();
    }
  }];
  const answers = await inquirer.prompt(promptList);
  var cloneUrl = "";
  if (answers["project-type"] === "pc") {
    cloneUrl = "github:yxy199399/kooshua-pc";
  } else if (answers["project-type"] === "phone") {
    cloneUrl = "github:yxy199399/mobile_project";
  }

  log(`创建项目：  ${name}`);
  await clone(cloneUrl, name);

  log("修改名称")
  // 修改项目名称
  var jsondata = fs.readFileSync(path.join(__dirname, `../${name}/package.json`), 'utf8')
  var fileData = JSON.parse(jsondata);
  fileData.name = name;
  fs.writeFileSync(path.join(__dirname, `../${name}/package.json`), JSON.stringify(fileData, null, "\t"));
  // // 自动安装依赖
  // log("安装依赖");
  // await spawn("npm", ['install'], {cwd: `./${name}`});
  // log("安装完成")
}
