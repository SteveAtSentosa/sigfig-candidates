export default (entity: object) => {
  const jsonPatch = []
  for (const key in entity) {
    jsonPatch.push({ 'op': 'replace', 'path': `/${key}`, 'value': entity[key] })
  }
  return jsonPatch
}
