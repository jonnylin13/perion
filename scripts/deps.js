const fs = require('fs');
const mainPkgJson = fs.readFileSync('./package.json');
const mainPkg = JSON.parse(mainPkgJson);
const devDeps = mainPkg.devDependencies;
for (const dir of fs.readdirSync('./packages')) {
  try {
    const pkgJson = fs.readFileSync(`./packages/${dir}/package.json`);
    const pkg = JSON.parse(pkgJson);
    pkg.devDependencies = Object.assign({}, devDeps);
    pkg.scripts.test = mainPkg.scripts.test;
    pkg.scripts.lint = mainPkg.scripts.lint;
    fs.writeFileSync(`./packages/${dir}/package.json`, JSON.stringify(pkg, null, 2));
  } catch (err) {
     /** Generate */
     const clonedPkg = Object.assign({}, mainPkg);
     clonedPkg.name = `@perion/${dir}`;
     clonedPkg.description = '';
     clonedPkg.version = '0.0.0';
     fs.writeFileSync(`./packages/${dir}/package.json`, JSON.stringify(clonedPkg, null, 2));
  }
}