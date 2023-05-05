"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const handleGenNewPpt = (outputDir, inputDir) => {
    (0, child_process_1.exec)(`sh ./src/scripts/zip.sh ${inputDir} ${outputDir}`, (error, stdout, stderr) => {
        if (error || stderr) {
            console.log(error || stderr);
        }
        console.log(stdout);
    });
};
exports.default = handleGenNewPpt;
