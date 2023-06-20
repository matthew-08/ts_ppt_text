"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const cwd_1 = __importDefault(require("./cwd"));
const handleGenNewPpt = (outputDir, inputDir) => {
    const child = (0, child_process_1.exec)(`sh ./scripts/zip.sh ${inputDir} ${outputDir}`, {
        cwd: (0, cwd_1.default)(),
    }, (err) => {
        console.log(err);
    });
    return new Promise((resolve) => {
        child.on('close', resolve);
    });
};
exports.default = handleGenNewPpt;
