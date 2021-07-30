import FileSaver from 'file-saver';

export function generateCsvAndDownload(data, name, headers = Object.keys(data)) {
  const text = [headers.map(field => `"${field || ''}"`).join(';')];
  text.push(...data.map(item => headers.map(field => `"${item[field] || ''}"`).join(';')));
  // eslint-disable-next-line no-undef
  const blob = new Blob([String.fromCharCode(0xFEFF) + text.join('\n')], { type: 'text/csv;charset=utf-8' });
  FileSaver.saveAs(blob, `${name}.csv`);
}
