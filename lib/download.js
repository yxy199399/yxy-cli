const { promisify } = require("util");
const fs = require('fs');
const handlebars = require("handlebars");
module.exports.clone = async function(repo, desc) {
  const download = promisify(require("download-git-repo"));
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
    console.log(fileName, content, result)
    fs.writeFileSync(fileName, result);
  }
} 