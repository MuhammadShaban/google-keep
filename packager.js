const { renameSync, existsSync, mkdirSync } = require('fs');
const { join } = require('path');
const { zip } = require('zip-a-folder');
const { name, version } = require('./package.json');
const packagesPath = join(__dirname, 'packages');
const packagesVersionPath = join(packagesPath, version);

// Create packages folder if not exists
if (!existsSync(packagesPath)) mkdirSync(packagesPath);
if (!existsSync(packagesVersionPath)) mkdirSync(packagesVersionPath);

const package = {
    windows: function () {
        const files = [
            { from: `${name} ${version}.exe`, to: `${name}-${version}.exe` },
            { from: `${name} Setup ${version}.exe`, to: `${name}-setup-${version}.exe` }
        ];

        const folders = [
            { from: 'win-unpacked', to: `${name}-${version}-windows-x64.zip` },
            { from: 'win-ia32-unpacked', to: `${name}-${version}-windows-x86.zip` }
        ];

        files.forEach(file => this.move(file));
        folders.forEach(folder => this.archive(folder));
    },
    linux: function () {
        const files = [
            { from: `${name}-${version}.AppImage`, to: `${name}-${version}.AppImage` },
        ];

        const folders = [
            { from: 'linux-unpacked', to: `${name}-${version}-linux-x64.zip` }
        ];

        files.forEach(file => this.move(file));
        folders.forEach(folder => this.archive(folder));
    },
    move: function (file) {
        const oldFilePath = this.releasePath(file.from);
        const newFilePath = this.packagePath(file.to);

        if (existsSync(oldFilePath)) renameSync(oldFilePath, newFilePath);
    },
    archive: async function (folder) {
        const oldFolderPath = this.releasePath(folder.from);
        const newFolderPath = this.packagePath(folder.to);

        if (existsSync(oldFolderPath)) await zip(oldFolderPath, newFolderPath);
    },
    releasePath: function (file) {
        return join(__dirname, 'release', file);
    },
    packagePath: function (file) {
        return join(__dirname, 'packages', version, file);
    }
}


package.windows();
package.linux();
