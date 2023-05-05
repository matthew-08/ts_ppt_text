"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const replaceXMLText = (startAndEndIndex, updatedText, rawXML) => {
    const { startIndex, endIndex } = startAndEndIndex;
    return (rawXML.substring(startIndex, 0) + updatedText + rawXML.substring(endIndex));
};
exports.default = replaceXMLText;
