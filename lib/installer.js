"use strict";
/**
 * Installer
 *
 * @module
 */

var fs = require("fs");
var https = require("https");
var path = require("path");

var unzip = require("unzip");

var links = require("./links");
/**
 * Downloads file
 *
 * @function
 * @arg {string} fileUrl - URL of file to download.
 * @arg {string} filePath - Path of file to download.
 * @return {Promise}
 */
var download = (fileUrl, filePath) => {
    var file = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {

        https.get(fileUrl, response => {

            response.pipe(file);
            file.on("finish", () => {
                file.close(resolve);
            });

        }).on("error", err => {

            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            reject(err);
        });
    });
};
/**
 * Extracts zip file.
 *
 * @function
 * @arg {string} archivePath - Path to zip file.
 * @arg {string} extractPath - Path to put extracted content.
 * @return {Promise}
 */
var extract = (archivePath, extractPath) => {
    var file = fs.createReadStream(archivePath)

    return new Promise((resolve, reject) => {

        file.pipe(unzip.Extract({ path: extractPath }));
        file.on("close", resolve);
        file.on("error", reject);
    });
};

var result = Promise.resolve();

Object.keys(links).forEach(linkName => {

    var fileUrl = links[linkName];
    var filePath = path.resolve(path.dirname(__dirname),
                                linkName + ".zip");
    var extrDir = path.resolve(path.dirname(__dirname),
                               "." + linkName)

    result = result.then(() => {
        console.log(`Installing ${linkName}...`);
    }).then(() => {
        return download(fileUrl, filePath);
    }).then(() => {
        return extract(filePath, extrDir);
    }).then(() => {
        return fs.unlinkSync(filePath);
    }).catch(e => {
        console.log(e);
        process.exit(1);
    }).then(() => {
        console.log(`${linkName} is extracted to ${extrDir}`);
    });
});
