declare const replaceXMLText: (startAndEndIndex: {
    startIndex: number;
    endIndex: number;
}, updatedText: string, rawXML: string) => string;
export default replaceXMLText;
