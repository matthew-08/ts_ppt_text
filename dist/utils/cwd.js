"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const cwd = () => {
    return path_1.default.join(process.cwd(), 'node_modules', 'ts_ppt_text', 'dist');
};
exports.default = cwd;
