const fs = require('fs');
const mainPkgJson = fs.readFileSync('./package.json');
const mainPkg = JSON.parse(mainPkgJson);
const {exec} = require('child_process');
function command(cmd, meta=true) {
  return new Promise(resolve => {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        console.log(`Could not publish ${meta}`); 
        console.log(stderr);
        resolve(false);
        return;
      }
      console.log(stdout);
      resolve(meta);
    });
  });
}
const promises = [];
for (const dir of fs.readdirSync('./packages')) {
  promises.push(command(`cd ./packages/${dir}`));
  promises.push(command(`npm i --package-lock-only`));
  promises.push(command(`cd ../..`));
}
Promise.all(promises).finally(() => {
  console.log('Done');
});