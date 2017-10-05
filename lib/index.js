"use strict";
/**
 * Activator
 *
 * @module
 */

var fs = require("fs");
var path = require("path");

/**
 * Finds executable file.
 *
 * @function
 * @arg {string} exeName - Executable file name.
 * @arg {string} dirName - Directory name of project.
 * @return {string} - Directory of executable file.
 */
var findExe = (exeName, dirName) => {
    var rootDir = path.resolve(path.dirname(__dirname), dirName);
    var folders = [rootDir];

    while (folders.length) {

        var folder = folders.shift();
        var files = fs.readdirSync(folder);

        for (var fileName of files) {
            var filePath = path.resolve(folder, fileName);

            if (fs.statSync(filePath).isDirectory()) {
                folders.push(filePath);
                continue;
            };
            if (fileName === exeName) return folder;
        };
    };
    throw new Error(`Executable file ${exeName} isn't found`);
};
/**
 * Adds ffmpeg to $PATH.
 *
 * @function
 */
module.exports.activateFFmpeg = () => {
    var exeDir = findExe("ffmpeg.exe", ".ffmpeg");
    process.env.PATH = exeDir + path.delimiter + process.env.PATH;
};
/**
 * Adds ImageMagick to $PATH.
 *
 * @function
 */
module.exports.activateImageMagick = () => {
    var exeDir = findExe("compare.exe", ".imageMagick");
    process.env.PATH = exeDir + path.delimiter + process.env.PATH;
};
