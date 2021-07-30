export default (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1])
  const arr = new Uint8Array(byteString.length)

  for (let i = 0; i < byteString.length; i++) {
    arr[i] = byteString.charCodeAt(i)
  }

  let buffer = Buffer.from(arr.buffer)

  if (arr.byteLength !== arr.buffer.byteLength) {
    buffer = buffer.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
  }

  return buffer
}
