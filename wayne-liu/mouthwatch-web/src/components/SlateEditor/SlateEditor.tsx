import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react'
import { Editor, Transforms, createEditor } from 'slate'
import {
  IconDefinition,
  faBold,
  faItalic,
  faListOl,
  faListUl,
  faQuoteLeft,
  faUnderline
} from '@fortawesome/free-solid-svg-icons'
import React, { useCallback, useMemo, useState } from 'react'
import { faH1, faH2, faH3, faH4 } from '@fortawesome/pro-regular-svg-icons'
import { parse, serialize } from './utils'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import isHotkey from 'is-hotkey'
import { withHistory } from 'slate-history'

const styles = require('./styles.scss')

interface OwnProps {
  initialValue?: string
  buttons?: ButtonDef[]
  onChange (policy: string): void
  maxHeight?: string
}

/**
 * SlateEditor - a wrapper for Slate
 *   The component should have its own isolated state, using redux would result incorrect repaints and slowness
 *   See these github issues for further explanation: https://github.com/ianstormtaylor/slate/issues/3478
 *   and https://github.com/ianstormtaylor/slate/issues/3575
 */
const SlateEditor = (props: OwnProps) => {
  const [value, setValue] = useState(() => {
    // If no initial value is passed, init Slate with an empty editor
    if (!props.initialValue) return emptyEditorValue
    // Initial value is serialized html from the DB so it needs to parsed to Slate's JSON format
    return parse(props.initialValue)
  })
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHtml(withHistory(withReact(createEditor()))), [])
  const selectedButtons = props.buttons || buttons

  /**
   * We're storing the editor content's in Slate's JSON format, but we pass serialized html to the callback
   * @param value Nodes from slate
   */
  const handleChange = value => {
    setValue(value)
    props.onChange(serialize(editor))
  }

  return (
    <div
      className={styles.editorWrapper}
      style={{
        maxHeight: props.maxHeight || 'auto',
        overflowY: props.maxHeight ? 'auto' : undefined
      }}
    >
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Toolbar>
          {selectedButtons.filter(b => b.enabled).map(button =>
            button.type === 'mark'
              ? <MarkButton key={button.format} format={button.format} icon={button.icon} />
              : <BlockButton key={button.format} format={button.format} icon={button.icon} />
          )}
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, undefined, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </Slate>
    </div>
  )
}

// Below is bunch of boilerplate code for Slate, based on / modified from their docs and examples

const LIST_TYPES = ['numbered-list', 'bulleted-list']

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline'
}

const emptyEditorValue = [
  {
    type: 'paragraph',
    children: [
      { text: '' }
    ]
  }
]

interface ButtonDef {
  format: string
  icon: IconDefinition
  type: 'mark' | 'block'
  enabled: boolean
}

const buttons: ButtonDef[] = [
  { format: 'bold', icon: faBold, type: 'mark', enabled: true },
  { format: 'italic', icon: faItalic, type: 'mark', enabled: true },
  { format: 'underline', icon: faUnderline, type: 'mark', enabled: true },
  { format: 'heading-one', icon: faH1, type: 'block', enabled: true },
  { format: 'heading-two', icon: faH2, type: 'block', enabled: true },
  { format: 'heading-three', icon: faH3, type: 'block', enabled: true },
  { format: 'heading-four', icon: faH4, type: 'block', enabled: true },
  { format: 'block-quote', icon: faQuoteLeft, type: 'block', enabled: false },
  { format: 'numbered-list', icon: faListOl, type: 'block', enabled: true },
  { format: 'bulleted-list', icon: faListUl, type: 'block', enabled: true }
]

const toggleBlock = (editor: ReactEditor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n => LIST_TYPES.includes(n.type),
    split: true
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format
  })

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: ReactEditor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor: ReactEditor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: n => n.type === format
  })

  return !!match
}

const isMarkActive = (editor: ReactEditor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const Button = ({ active, children, ...rest }) => (
  <a
    {...rest}
    style={{
      color: active ? '#056FB5' : '#CCCED0'
    }}
  >
    {children}
  </a>
)

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <FontAwesomeIcon icon={icon} />
    </Button>
  )
}

const Toolbar = ({ children }) => (
  <div className={styles.toolbar}>
    {children}
  </div>
)

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'link':
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  if (leaf.code) {
    children = <code>{children}</code>
  }
  if (leaf.italic) {
    children = <em>{children}</em>
  }
  if (leaf.underline) {
    children = <u>{children}</u>
  }
  if (leaf.strikethrough) {
    children = <del>{children}</del>
  }
  return <span {...attributes}>{children}</span>
}

const withHtml = (editor: Editor & ReactEditor) => {
  const { insertData, isInline, isVoid } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.insertData = data => {
    const html = data.getData('text/html')

    if (html) {
      const fragment = parse(html)
      Transforms.insertFragment(editor, fragment)
      return
    }

    insertData(data)
  }

  return editor
}

export default SlateEditor
