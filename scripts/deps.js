const fs = require('fs');
const mainPkgJson = fs.readFileSync('./package.json');
const mainPkg = JSON.parse(mainPkgJson);
const devDeps = mainPkg.devDependencies;

const submoduleTestScript = 'nyc mocha test/*.js';
for (const dir of fs.readdirSync('./packages')) {
  try {
    const pkgJson = fs.readFileSync(`./packages/${dir}/package.json`);
    const pkg = JSON.parse(pkgJson);
    pkg.devDependencies = Object.assign({}, devDeps);
    pkg.scripts.test = submoduleTestScript;
    pkg.scripts.lint = mainPkg.scripts.lint;
    pkg.bugs = mainPkg.bugs;
    pkg.license = mainPkg.license;
    fs.writeFileSync(`./packages/${dir}/package.json`, JSON.stringify(pkg, null, 2));
  } catch (err) {
     /** Generate */
     const clonedPkg = Object.assign({}, mainPkg);
     clonedPkg.name = `@perion/${dir}`;
     clonedPkg.description = '';
     clonedPkg.version = '0.0.0';
     clonedPkg.scripts = {};
     clonedPkg.scripts.test = submoduleTestScript;
     clonedPkg.scripts.lint = mainPkg.scripts.lint;
     delete clonedPkg.dependencies;
     fs.writeFileSync(`./packages/${dir}/package.json`, JSON.stringify(clonedPkg, null, 2));
  }
}