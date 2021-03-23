const fs = require('fs');
const mainPkgJson = fs.readFileSync('./package.json');
const mainPkg = JSON.parse(mainPkgJson);
const deps = mainPkg.dependencies;
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

function publishModule(updatedSubmodules) {
  return new Promise(resolve => {
    for (const data of updatedSubmodules) {
      if (!data) continue;
      mainPkg.dependencies[data.dep] = data.version;
    }
    try {
      fs.writeFileSync(`./package.json`, JSON.stringify(mainPkg, null, 2));
    } catch (err) {
      console.log('Could not write to main package.json');
      console.log(err);
    } finally {
      command(`npm publish --access public`).then(res => {
        if (!res) console.log('Could not publish main package');
        else console.log('Done');
      })
    }
  });
}

function publishSubmodules() {
  return new Promise(resolve => {
    const promises = [];
    for (const dep of Object.keys(deps)) {
      try {
        const oldVersion = deps[dep];
        const pkgJson = fs.readFileSync(`./packages/${dep.split('/')[1]}/package.json`);
        const pkg = JSON.parse(pkgJson);
        const {version} = pkg;

        if (version !== oldVersion) {
          // Publish the package
          promises.push(command(`npm publish ./packages/${dep.split('/')[1]}`, {dep, version}));
        }
    
      } catch (err) {
        console.log(`Could not read file for ${dep}`);
        console.log(err);
      }
    }
    Promise.all(promises).then(res => {
      publishModule(res);
    });
  });
}

publishSubmodules();

