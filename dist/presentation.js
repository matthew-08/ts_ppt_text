"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const slide_1 = __importDefault(require("./slide"));
const prepareSlides_1 = __importDefault(require("./utils/prepareSlides"));
const promises_1 = __importDefault(require("fs/promises"));
const sortSlides_1 = __importDefault(require("./utils/sortSlides"));
const handleGenNewPpt_1 = __importDefault(require("./utils/handleGenNewPpt"));
class Presentation {
    constructor(filePath, dirName) {
        this.filePath = filePath;
        this.dirName = dirName;
        this.tempDirectory = `${this.dirName}/_ppt-temp_`;
        this.generateTempFile();
        this.slidesPreparing = null;
        this.slidesExtracting = null;
        this.extractSlides();
        this.slides = [];
    }
    getSlides() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield Promise.all([
                this.slidesExtracting,
                this.slidesPreparing,
            ]).then((res) => this.slides);
        });
    }
    generateTempFile() {
        (0, child_process_1.exec)(`sh ./scripts/extract.sh ${this.tempDirectory} ${this.filePath}`, {
            cwd: path_1.default.join(process.cwd(), 'node_modules', 'ts_ppt_text', 'dist'),
        }, (error, stdout, stderr) => {
            if (error || stderr) {
                console.log(error || stderr);
            }
            console.log(stdout);
        });
    }
    addSlides(preparedSlides) {
        preparedSlides.forEach(({ bufferOrString, slideName }) => {
            const slide = new slide_1.default(bufferOrString, slideName);
            this.slides = [...this.slides, slide];
        });
    }
    generateSlides(files) {
        return __awaiter(this, void 0, void 0, function* () {
            const filePathsAndNames = files.map((fname) => {
                return {
                    fileName: fname,
                    filePath: path_1.default.resolve(`${this.tempDirectory}/ppt/slides/${fname}`),
                };
            });
            // prepareSlides generates what is needed for the slide class constructor
            this.slidesPreparing = (0, prepareSlides_1.default)(filePathsAndNames);
            yield this.slidesPreparing.then((res) => {
                return this.addSlides(res);
            });
        });
    }
    extractSlides() {
        this.slidesExtracting = promises_1.default
            .readdir(`${this.tempDirectory}/ppt/slides`)
            .then((res) => {
            const filterRels = res.filter((file) => file != '_rels');
            const sortedFiles = (0, sortSlides_1.default)(filterRels);
            if (sortedFiles) {
                return this.generateSlides(sortedFiles);
            }
        });
    }
    applySlideChanges() {
        this.slides.forEach((slide) => {
            slide.writeToFile(this.tempDirectory);
        });
    }
    generateNewPPT(outputPath) {
        (0, handleGenNewPpt_1.default)(path_1.default.resolve(outputPath), path_1.default.resolve(`${this.tempDirectory}`));
    }
}
exports.default = Presentation;
