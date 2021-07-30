import escapeHtml from 'escape-html'
import { Node, Text } from 'slate'
import { jsx } from 'slate-hyperscript'

// This is based on https://github.com/ianstormtaylor/slate/blob/master/site/examples/paste-html.js

const ELEMENT_TAGS = [
  {
    html: 'A',
    type: 'link',
    attr: (el: HTMLElement) => ({ type: 'link', url: el.getAttribute('href') }),
    serializer: (children: string) => `<a href>${children}</a>`
  },
  {
    html: 'BLOCKQUOTE',
    type: 'quote',
    attr: (_el: HTMLElement) => ({ type: 'quote' }),
    serializer: (children: string) => `<blockquote><p>${children}</p></blockquote>`
  },
  {
    html: 'H1',
    type: 'heading-one',
    attr: (_el: HTMLElement) => ({ type: 'heading-one' }),
    serializer: (children: string) => `<h1>${children}</h1>`
  },
  {
    html: 'H2',
    type: 'heading-two',
    attr: (_el: HTMLElement) => ({ type: 'heading-two' }),
    serializer: (children: string) => `<h2>${children}</h2>`
  },
  {
    html: 'H3',
    type: 'heading-three',
    attr: (_el: HTMLElement) => ({ type: 'heading-three' }),
    serializer: (children: string) => `<h3>${children}</h3>`
  },
  {
    html: 'H4',
    type: 'heading-four',
    attr: (_el: HTMLElement) => ({ type: 'heading-four' }),
    serializer: (children: string) => `<h4>${children}</h4>`
  },
  {
    html: 'H5',
    type: 'heading-five',
    attr: (_el: HTMLElement) => ({ type: 'heading-five' }),
    serializer: (children: string) => `<h5>${children}</h5>`
  },
  {
    html: 'H6',
    type: 'heading-six',
    attr: (_el: HTMLElement) => ({ type: 'heading-six' }),
    serializer: (children: string) => `<h6>${children}</h6>`
  },
  {
    html: 'LI',
    type: 'list-item',
    attr: (_el: HTMLElement) => ({ type: 'list-item' }),
    serializer: (children: string) => `<li>${children}</li>`
  },
  {
    html: 'OL',
    type: 'numbered-list',
    attr: (_el: HTMLElement) => ({ type: 'numbered-list' }),
    serializer: (children: string) => `<ol>${children}</ol>`
  },
  {
    html: 'P',
    type: 'paragraph',
    attr: (_el: HTMLElement) => ({ type: 'paragraph' }),
    serializer: (children: string) => `<p>${children}</p>`
  },
  {
    html: 'PRE',
    type: 'code',
    attr: () => ({ type: 'code' }),
    serializer: children => `<pre>${children}</pre>`
  },
  {
    html: 'UL',
    type: 'bulleted-list',
    attr: () => ({ type: 'bulleted-list' }),
    serializer: children => `<ul>${children}</ul>`
  }
]

const TEXT_TAGS = [
  {
    html: 'CODE',
    type: 'code',
    attr: () => ({ code: true })
  },
  {
    html: 'DEL',
    type: 'strikethrough',
    attr: () => ({ strikethrough: true })
  },
  {
    html: 'EM',
    type: 'italic',
    attr: () => ({ italic: true })
  },
  {
    html: 'I',
    type: 'italic',
    attr: () => ({ italic: true })
  },
  {
    html: 'S',
    type: 'strikethrough',
    attr: () => ({ strikethrough: true })
  },
  {
    html: 'STRONG',
    type: 'bold',
    attr: () => ({ bold: true })
  },
  {
    html: 'B',
    type: 'bold',
    attr: () => ({ bold: true })
  },
  {
    html: 'U',
    type: 'underline',
    attr: () => ({ underline: true })
  }
]

export const serialize = (node: Node): string => {
  try {
    if (Text.isText(node)) {
      const tag = TEXT_TAGS.find(tag => node[tag.type])
      if (tag) {
        return `<${tag.html}>${escapeHtml(node.text)}</${tag.html}>`
      } else {
        return escapeHtml(node.text)
      }
    }

    const children = node.children.map(n => serialize(n)).join('')
    const tag = ELEMENT_TAGS.find(tag => tag.type === node.type)

    if (tag) {
      return tag.serializer(children)
    } else {
      return children
    }
  } catch (err) {
    console.error('Error while serializing nodes', err)
  }
}

const deserialize = (el: HTMLElement) => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent

  if (
    nodeName === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0]
  } else {
    parent = el
  }

  const children = (Array.from(parent.childNodes)
    .map(deserialize) as any)
    .flat()

  if (!children.length) children.push('')

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  const elTag = ELEMENT_TAGS.find(tag => tag.html === el.nodeName)
  if (elTag) {
    const attrs = elTag.attr(el)
    return jsx('element', attrs, children)
  }

  const textTag = TEXT_TAGS.find(tag => tag.html === el.nodeName)
  if (textTag) {
    const attrs = textTag.attr()
    return children.map(child => jsx('text', attrs, child))
  }

  return children
}

export const stringify = (nodes: Node[]): string => {
  return nodes.map(node => serialize(node)).reduce((acc, curr) => acc += curr)
}

export const parse = (stringWithHtml: string) => {
  const document = new DOMParser().parseFromString(stringWithHtml, 'text/html')
  return deserialize(document.body)
}
