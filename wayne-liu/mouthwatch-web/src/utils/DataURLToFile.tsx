export default (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1])
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
  const ab = new ArrayBuffer(byteString.length)
  const ia = new Uint8Array(ab)

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i)
  }

  const lastModified = new Date().getTime()
  const file = new File([ab], 'snapshot' + lastModified, { type: mimeString, lastModified })
  return file
}
