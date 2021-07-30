export interface Options {
  ending?: 'ellipses' | 'period' | 'none'
  complete?: boolean
}

export const Shorten = (text: string, maxChar: number, options: Options = {}) => {
  if (text.length > maxChar) {
    const { complete, ending } = options
    let end = ''
    switch (ending) {
      case 'ellipses':
        end = '...'
        break
      case 'none':
        end = ''
        break
      default:
        end = '.'
    }
    return text.substr(0, !complete ? maxChar : 1) + end
  } else {
    return text
  }
}
