export function csvToArray(string, delimiter = ',') {
  const pattern = new RegExp(
    (
      // Delimiters.
      `(\\${delimiter}|\\r?\\n|\\r|^)` +
      // Quoted fields.
      '(?:"([^"]*(?:""[^"]*)*)"|' +
      // Standard fields.
      `([^"\\${delimiter}\\r\\n]*))`
    ),
    'gi',
  );

  const array = [[]];
  let matches = pattern.exec(string);
  while (matches) {
    const matchedDelimiter = matches[1];

    if (matchedDelimiter.length && matchedDelimiter !== delimiter) {
      array.push([]);
    }

    array[array.length - 1]
      .push(matches[2] ? matches[2].replace(new RegExp('""', 'g'), '"') : matches[3]);
    matches = pattern.exec(string);
  }
  return (array);
}
