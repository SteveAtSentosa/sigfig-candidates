export default (data: object, map: object, inOrOut: 'in' | 'out'): object => {
  const mapReturn = (data, map) => {
    return Object.keys(data).reduce((acc, v) => {
      if (v in map) {
        let dataToTranslate = data[v]
        if (!['string', 'number', 'boolean'].includes(typeof data[v])) {
          if (Array.isArray(data[v])) { // check if you have nested data in array
            dataToTranslate = data[v].map((mD) => {
              return mapReturn(mD, map[v])
            })
          } else if (typeof data[v] === 'object' && !data[v].lastModified) { // check if you have nested data in object, make (somewhat) sure it isn't a File object
            dataToTranslate = mapReturn(data[v], map[v])
          }
          return Object.assign({}, acc, { [v]: dataToTranslate })
        }
        return Object.assign({}, acc, { [map[v]]: dataToTranslate })
      }
      return acc
    }, {})
  }

  const flipKeys = (map) => {
    return Object.keys(map).reduce((acc, v) => {
      if (typeof map[v] === 'object') { // check if you have keys of complex data structs
        const innerFlip = flipKeys(map[v])
        return Object.assign({}, acc, { [v]: innerFlip })
      }
      return Object.assign({}, acc, { [map[v]]: v })
    }, {})
  }

  if (!data) {
    return {}
  }
  if (Object.keys(map).length === 0 || Object.keys(data).length === 0) {
    return data
  }
  if (inOrOut === 'in') {
    return mapReturn(data, map)
  } else if (inOrOut === 'out') {
    return mapReturn(data, flipKeys(map))
  }
}
