/*
 * Copyright 2013 BlackBerry Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require("fs"),
    path = require("path"),
    wrench = require("wrench"),
    nodeCli = process.argv[0],
    webworksCli = path.resolve(__dirname, path.join("..", "..", "webworks-cli", "bin", "webworks"));

module.exports = {
    isValidProject: function (projectPath) {
        var isValid = true,
            cmdDir = path.join("platforms", "blackberry10", "cordova"),
            fileList = [
                "platforms",
                "plugins",
                "www",
                cmdDir
            ];

        fileList.forEach(function (filepath) {
            isValid &= fs.existsSync(path.normalize(path.join(projectPath, filepath)));
        });

        isValid &= fs.existsSync(this.getProjectConfigPath(projectPath));

        return isValid;
    },

    getProjectConfigPath: function (projectPath) {
        var configXmlPath = path.normalize(path.join(projectPath, "www", "config.xml")),
            configXmlRootPath = path.normalize(path.join(projectPath, "config.xml")),
            filepath;

        if (fs.existsSync(configXmlRootPath)) { // Check root location first
            filepath = configXmlRootPath
        } else if (fs.existsSync(configXmlPath)) { // Legacy location next
            filepath = configXmlPath
        } else { // Use root location if nothing found
            filepath = configXmlRootPath
        }

        return filepath;
    },

    getUserHome: function () {
        return process.env[(process.platform === "win32") ? "USERPROFILE" : "HOME"];
    },

    getCordovaDir: function () {
        var homePath = this.getUserHome(),
            cordovaPath = path.join(homePath, ".cordova");

        if (!fs.existsSync(cordovaPath)) {
            fs.mkdirSync(cordovaPath);
        }
        return cordovaPath;
    },

    getImagePreviewPath: function () {
        return path.resolve(path.join(this.getUserHome(), "/.cordova/webworks-gui/tmp/img"));
    },

    isWindows: function () {
        return process.platform.match(/^win/);
    },

    getNode: function () {
        return nodeCli;
    },

    getWebworksCli: function () {
        return webworksCli;
    },

    getPlatformProjectCommand: function (projectDir, cmd) {
        var cmdDir = path.join(projectDir, "platforms", "blackberry10", "cordova");
        return path.join(cmdDir, cmd + (this.isWindows() ? ".bat" : ""));
    },

    copyFile: function (srcFile, destDir, baseDir, newFileName) {
        var filename = newFileName ? newFileName : path.basename(srcFile),
            fileBuffer = fs.readFileSync(srcFile),
            fileLocation;

        //if a base directory was provided, determine
        //folder structure from the relative path of the base folder
        if (baseDir && srcFile.indexOf(baseDir) === 0) {
            fileLocation = srcFile.replace(baseDir, destDir);
            wrench.mkdirSyncRecursive(path.dirname(fileLocation), "0755");
            fs.writeFileSync(fileLocation, fileBuffer);
        } else {
            if (!fs.existsSync(destDir)) {
                wrench.mkdirSyncRecursive(destDir, "0755");
            }
            fs.writeFileSync(path.join(destDir, filename), fileBuffer);
        }
    },

    hashCode: function (str) {
        var hash = 0, i, char;
        if (str.length === 0) return hash;
        var l = str.length;
        for (i = 0; i < l; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    },

    getSafePath: function (str) {
        return path.resolve(str.replace("\\", "\\\\"));
    }
};
