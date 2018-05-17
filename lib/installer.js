"use strict";
/**
 * Installer
 *
 * @module
 */

var fs = require("fs");
var path = require("path");

var U = require("glace-utils");
var unzip = require("unzip");

var links = require("./links");

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
        return U.download([fileUrl], { paths: [filePath], attempts: 10 });
    }).then(result => {
        if (result.failed.length) {
            throw new Error(`Can't download ${filePath}. Check network connection.`)
        }
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
