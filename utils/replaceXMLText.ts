const replaceXMLText = (
  startAndEndIndex: {
    startIndex: number;
    endIndex: number;
  },
  updatedText: string,
  rawXML: string
): string => {
  const { startIndex, endIndex } = startAndEndIndex;
  return (
    rawXML.substring(startIndex, 0) + updatedText + rawXML.substring(endIndex)
  );
};
