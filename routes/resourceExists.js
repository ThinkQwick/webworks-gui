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
    apiUtil = require("../lib/util");

module.exports = {

    get: function (req, res) {
        var projectPath = req.query.path,
            filePath = req.query.filePath,
            resourcePath,
            exists;

        if (apiUtil.isValidProject(projectPath)) {
            resourcePath = path.join(projectPath, "www", filePath);
            exists = fs.existsSync(resourcePath);

            res.send(200, {
                success: true,
                exists: exists,
                normalizedPath: exists ? path.normalize(filePath) : ""
            });
        } else {
            res.send(500, { error: "'" + projectPath + "' does not exist' " });
        }
    }

};
