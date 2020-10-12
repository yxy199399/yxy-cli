const { promisify } = require("util");
// 控制台字体大小
const figlet = promisify(require("figlet"));

const clear = require("clear");
// 打印字体的颜色
const chalk = require("chalk");
// 控制台交互
const inquirer = require('inquirer');
const log = content  => console.log(chalk.green(content));
const { clone } = require("./download.js");
const spawn = async (...args) => {
  const { spawn } = require("child_process");
  return new Promise(resolve => {
    const proc = spawn(...args);
    // console.log(process.stdout)
    // proc.stdout.pipe(process.stdout);
    // proc.stderr.pipe(process.stderr);
    proc.on("close", () => {
      resolve()
    })
  })
}

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
    cloneUrl = "direct:http://10.0.55.2:30008/900143/base-pc.git";
  } else if (answers["project-type"] === "phone") {
    cloneUrl = "direct:http://10.0.55.2:30008/900143/base-phone.git";
  }

  log(`创建项目：  ${name}`);
  await clone(cloneUrl, name);

  // // 自动安装依赖
  log("安装依赖");
  await spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['install'], {
    stdio: 'inherit',
    cwd: `./${name}`
  });

  // git初始化
  let msg = 'init';
  await spawn("git", ['init'], {cwd: `./${name}`});

  // 目前不起作用
  await spawn("git", ['commit', '-m', msg], {cwd: `./${name}`});
  log(
`
安装完成
=====================================
  cd ${name}
  npm run serve
=====================================
`)
}

// git push -u origin main提交
