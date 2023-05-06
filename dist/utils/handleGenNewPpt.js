"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const cwd_1 = __importDefault(require("./cwd"));
const handleGenNewPpt = (outputDir, inputDir) => {
    (0, child_process_1.exec)(`sh ../scripts/extract.sh ${inputDir} ${outputDir}`, {
        cwd: (0, cwd_1.default)(),
    }, (error, stdout, stderr) => {
        if (error || stderr) {
            console.log(error || stderr);
        }
        console.log(stdout);
    });
};
exports.default = handleGenNewPpt;
