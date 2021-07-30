export default (buffer: number[]) => {
  return 'data:image/png;base64,' + btoa(buffer.reduce(function (data, byte) {
    return data + String.fromCharCode(byte)
  }, ''))
}
