/* eslint-disable */
/** copied and refactored from https://github.com/Khan/simple-markdown at 2020-02-02 */
// TODO: refactor for pass eslint, remove parse to html if will not needed, remove code blocks?


const preprocess = source => source.replace(/\r\n?/g, '\n')
  .replace(/\t/g, '')
  .replace(/\f/g, '    ');

const populateInitialState = (givenState, defaultState) => {
  const state = givenState || {};
  if (defaultState != null) {
    for (const prop in defaultState) {
      if (Object.prototype.hasOwnProperty.call(defaultState, prop)) {
        state[prop] = defaultState[prop];
      }
    }
  }
  return state;
};

/**
 * Creates a parser for a given set of rules, with the precedence
 * specified as a list of rules.
 *
 * @param {ParserRules} rules
 *     an object containing
 *     rule type -> {match, order, parse} objects
 *     (lower order is higher precedence)
 * @param {OptionalState} [defaultState]
 *
 * @returns {function(*=, *=): []}
 *     The resulting parse function, with the following parameters:
 *     @source: the input source string to be parsed
 *     @state: an optional object to be threaded through parse
 *         calls. Allows clients to add stateful operations to
 *         parsing, such as keeping track of how many levels deep
 *         some nesting is. For an example use-case, see passage-ref
 *         parsing in src/widgets/passage/passage-markdown.jsx
 */
const parserFor = (rules, defaultState) => {
  // Sorts rules in order of increasing order, then
  // ascending rule name in case of ties.
  const ruleList = Object.keys(rules).filter((type) => {
    const rule = rules[type];
    if (rule == null || rule.match == null) {
      return false;
    }
    const { order } = rule;
    if ((typeof order !== 'number' || !isFinite(order)) &&
                typeof console !== 'undefined') {
      console.warn(
        `simple-markdown: Invalid order for rule \`${type}\`: ${
          String(order)}`,
      );
    }
    return true;
  });

  ruleList.sort((typeA, typeB) => {
    const ruleA = (rules[typeA]);
    const ruleB = (rules[typeB]);
    const orderA = ruleA.order;
    const orderB = ruleB.order;

    // First sort based on increasing order
    if (orderA !== orderB) {
      return orderA - orderB;
    }

    const secondaryOrderA = ruleA.quality ? 0 : 1;
    const secondaryOrderB = ruleB.quality ? 0 : 1;

    if (secondaryOrderA !== secondaryOrderB) {
      return secondaryOrderA - secondaryOrderB;

      // Then based on increasing unicode lexicographic ordering
    } if (typeA < typeB) {
      return -1;
    } if (typeA > typeB) {
      return 1;
    }
    // Rules should never have the same name,
    // but this is provided for completeness.
    return 0;
  });

  let latestState;
  const nestedParse = (source, state) => {
    const result = [];
    state = state || latestState;
    latestState = state;
    while (source) {
      // store the best match, it's rule, and quality:
      let ruleType = null;
      let rule = null;
      let capture = null;
      let quality = NaN;

      // loop control variables:
      let i = 0;
      let currRuleType = ruleList[0];
      let currRule = (rules[currRuleType]);

      do {
        var currOrder = currRule.order;
        const prevCaptureStr = state.prevCapture == null ? '' : state.prevCapture[0];
        const currCapture = currRule.match(source, state, prevCaptureStr);

        if (currCapture) {
          const currQuality = currRule.quality ? currRule.quality(
            currCapture,
            state,
            prevCaptureStr,
          ) : 0;
          // This should always be true the first time because
          // the initial quality is NaN (that's why there's the
          // condition negation).
          if (!(currQuality <= quality)) {
            ruleType = currRuleType;
            rule = currRule;
            capture = currCapture;
            quality = currQuality;
          }
        }

        // Move on to the next item.
        // Note that this makes `currRule` be the next item
        i++;
        currRuleType = ruleList[i];
        currRule = (rules[currRuleType]);
      } while (
      // keep looping while we're still within the ruleList
        currRule && (
        // if we don't have a match yet, continue
          !capture || (
          // or if we have a match, but the next rule is
          // at the same order, and has a quality measurement
          // functions, then this rule must have a quality
          // measurement function (since they are sorted before
          // those without), and we need to check if there is
          // a better quality match
            currRule.order === currOrder &&
                        currRule.quality
          )
        )
      );

      // TODO(aria): Write tests for these
      if (rule == null || capture == null /* :: || ruleType == null */) {
        throw new Error(
          `${'Could not find a matching rule for the below ' +
                    'content. The rule with highest `order` should ' +
                    'always match content provided to it. Check ' +
                    "the definition of `match` for '"}${
            ruleList[ruleList.length - 1]
          }'. It seems to not match the following source:\n${
            source}`,
        );
      }
      if (capture.index) { // If present and non-zero, i.e. a non-^ regexp result:
        throw new Error(
          '`match` must return a capture starting at index 0 ' +
                    '(the current parse index). Did you forget a ^ at the ' +
                    'start of the RegExp?',
        );
      }

      const parsed = rule.parse(capture, nestedParse, state);
      // We maintain the same object here so that rules can
      // store references to the objects they return and
      // modify them later. (oops sorry! but this adds a lot
      // of power--see reflinks.)
      if (Array.isArray(parsed)) {
        Array.prototype.push.apply(result, parsed);
      } else {
        // We also let rules override the default type of
        // their parsed node if they would like to, so that
        // there can be a single output function for all links,
        // even if there are several rules to parse them.
        if (parsed.type == null) {
          parsed.type = ruleType;
        }
        result.push(parsed);
      }

      state.prevCapture = capture;
      source = source.substring(state.prevCapture[0].length);
    }
    return result;
  };

  return function (source, state) {
    latestState = populateInitialState(state, defaultState);
    if (!latestState.inline && !latestState.disableAutoBlockNewlines) {
      source = `${source}\n\n`;
    }
    // We store the previous capture so that match functions can
    // use some limited amount of lookbehind. Lists use this to
    // ensure they don't match arbitrary '- ' or '* ' in inline
    // text (see the list rule for more information). This stores
    // the full regex capture object, if there is one.
    latestState.prevCapture = null;
    return nestedParse(preprocess(source), latestState);
  };
};

// Creates a match function for an inline scoped element from a regex
const inlineRegex = (regex) => {
  const match = (source, state) => {
    if (state.inline) {
      return regex.exec(source);
    }
    return null;
  };
  match.regex = regex;
  return match;
};

// Creates a match function for a block scoped element from a regex
const blockRegex = (regex) => {
  const match = (source, state) => {
    if (state.inline) {
      return null;
    }
    return regex.exec(source);
  };
  match.regex = regex;
  return match;
};

// Creates a match function from a regex, ignoring block/inline scope
const anyScopeRegex = (regex) => {
  const match = (source, state) => regex.exec(source);
  match.regex = regex;
  return match;
};

const TYPE_SYMBOL =
    (typeof Symbol === 'function' && Symbol.for &&
     Symbol.for('react.element')) ||
    0xeac7;

const reactElement = (type, key, props) => {
  return ({
    $$typeof: TYPE_SYMBOL,
    type,
    key: key == null ? undefined : key,
    ref: null,
    props,
    _owner: null,
  } /* : any */);
};

const htmlTag = function (tagName, content, attributes, isClosed) {
  attributes = attributes || {};
  isClosed = typeof isClosed !== 'undefined' ? isClosed : true;

  let attributeString = '';
  for (const attr in attributes) {
    const attribute = attributes[attr];
    // Removes falsey attributes
    if (Object.prototype.hasOwnProperty.call(attributes, attr) &&
                attribute) {
      attributeString += ` ${
        sanitizeText(attr)}="${
        sanitizeText(attribute)}"`;
    }
  }

  const unclosedTag = `<${tagName}${attributeString}>`;

  if (isClosed) {
    return `${unclosedTag + content}</${tagName}>`;
  }
  return unclosedTag;
};

const EMPTY_PROPS = {};

const SANITIZE_TEXT_R = /[<>&"']/g;
const SANITIZE_TEXT_CODES = {
  '<': '&lt;',
  '>': '&gt;',
  '&': '&amp;',
  '"': '&quot;',
  "'": '&#x27;',
  '/': '&#x2F;',
  '`': '&#96;',
};

const sanitizeText = function (text) {
  return String(text).replace(SANITIZE_TEXT_R, chr => SANITIZE_TEXT_CODES[chr]);
};

/**
 * Parse some content with the parser `parse`, with state.inline
 * set to true. Useful for block elements; not generally necessary
 * to be used by inline elements (where state.inline is already true.
 *
 * @param {Parser} parse
 * @param {string} content
 * @param {State} state
 * @returns {ASTNode}
 */
const parseInline = function (parse, content, state) {
  const isCurrentlyInline = state.inline || false;
  state.inline = true;
  const result = parse(content, state);
  state.inline = isCurrentlyInline;
  return result;
};

const parseCaptureInline = function (capture, parse, state) {
  return {
    content: parseInline(parse, capture[1], state),
  };
};

const ignoreCapture = function () {
  return {};
};

// recognize a `*` `-`, `+`, `1.`, `2.`... list bullet
const LIST_BULLET = '(?:[*+-]|\\d+\\.)';
// recognize the start of a list item:
// leading space plus a bullet plus a space (`   * `)
const LIST_ITEM_PREFIX = `( *)(${LIST_BULLET}) +`;
const LIST_ITEM_PREFIX_R = new RegExp(`^${LIST_ITEM_PREFIX}`);
// recognize an individual list item:
//  * hi
//    this is part of the same item
//
//    as is this, which is a new paragraph in the same item
//
//  * but this is not part of the same item
const LIST_ITEM_R = new RegExp(
  `${LIST_ITEM_PREFIX
  }[^\\n]*(?:\\n` +
    `(?!\\1${LIST_BULLET} )[^\\n]*)*(\n|$)`,
  'gm',
);
const BLOCK_END_R = /\n{2,}$/;
const INLINE_CODE_ESCAPE_BACKTICKS_R = /^ (?= *`)|(` *) $/g;
// recognize the end of a paragraph block inside a list item:
// two or more newlines at end end of the item
const LIST_BLOCK_END_R = BLOCK_END_R;
const LIST_ITEM_END_R = / *\n+$/;
// check whether a list item has paragraphs: if it does,
// we leave the newlines at the end
const LIST_R = new RegExp(
  `^( *)(${LIST_BULLET}) ` +
    '[\\s\\S]+?(?:\n{2,}(?! )' +
    `(?!\\1${LIST_BULLET} )\\n*` +
    // the \\s*$ here is so that we can parse the inside of nested
    // lists, where our content might end before we receive two `\n`s
    '|\\s*\n*$)',
);
const LIST_LOOKBEHIND_R = /(?:^|\n)( *)$/;

let currOrder = 0;
const defaultRules = {
  Array: {
    react(arr, output, state) {
      const oldKey = state.key;
      const result = [];

      // map output over the ast, except group any text
      // nodes together into a single string output.
      for (let i = 0, key = 0; i < arr.length; i++, key++) {
        // `key` is our numerical `state.key`, which we increment for
        // every output node, but don't change for joined text nodes.
        // (i, however, must change for joined text nodes)
        state.key = `${i}`;

        let node = arr[i];
        if (node.type === 'text') {
          node = { type: 'text', content: node.content };
          for (; i + 1 < arr.length && arr[i + 1].type === 'text'; i++) {
            node.content += arr[i + 1].content;
          }
        }

        result.push(output(node, state));
      }

      state.key = oldKey;
      return result;
    },
    html(arr, output, state) {
      let result = '';

      // map output over the ast, except group any text
      // nodes together into a single string output.
      for (let i = 0, key = 0; i < arr.length; i++) {
        let node = arr[i];
        if (node.type === 'text') {
          node = { type: 'text', content: node.content };
          for (; i + 1 < arr.length && arr[i + 1].type === 'text'; i++) {
            node.content += arr[i + 1].content;
          }
        }

        result += output(node, state);
      }
      return result;
    },
  },
  heading: {
    order: currOrder++,
    match: blockRegex(/^ *(#{1,6})([^\n]+?)#* *(?:\n *)+\n/),
    parse(capture, parse, state) {
      return {
        level: capture[1].length,
        content: parseInline(parse, capture[2].trim(), state),
      };
    },
    react(node, output, state) {
      return reactElement(
        `h${node.level}`,
        state.key,
        {
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      return htmlTag(`h${node.level}`, output(node.content, state));
    },
  },
  lheading: {
    order: currOrder++,
    match: blockRegex(/^([^\n]+)\n *(=|-){3,} *(?:\n *)+\n/),
    parse(capture, parse, state) {
      return {
        type: 'heading',
        level: capture[2] === '=' ? 1 : 2,
        content: parseInline(parse, capture[1], state),
      };
    },
    react: null,
    html: null,
  },
  hr: {
    order: currOrder++,
    match: blockRegex(/^( *[-*_]){3,} *(?:\n *)+\n/),
    parse: ignoreCapture,
    react(node, output, state) {
      return reactElement(
        'hr',
        state.key,
        EMPTY_PROPS,
      );
    },
    html(node, output, state) {
      return '<hr>';
    },
  },
  codeBlock: {
    order: currOrder++,
    match: blockRegex(/^(?: {4}[^\n]+\n*)+(?:\n *)+\n/),
    parse(capture, parse, state) {
      const content = capture[0]
        .replace(/^ {4}/gm, '')
        .replace(/\n+$/, '');
      return {
        lang: undefined,
        content,
      };
    },
    react(node, output, state) {
      const className = node.lang ?
        `markdown-code-${node.lang}` :
        undefined;

      return reactElement(
        'pre',
        state.key,
        {
          children: reactElement(
            'code',
            null,
            {
              className,
              children: node.content,
            },
          ),
        },
      );
    },
    html(node, output, state) {
      const className = node.lang ?
        `markdown-code-${node.lang}` :
        undefined;

      const codeBlock = htmlTag('code', sanitizeText(node.content), {
        class: className,
      });
      return htmlTag('pre', codeBlock);
    },
  },
  fence: {
    order: currOrder++,
    match: blockRegex(/^ *(`{3,}|~{3,}) *(?:(\S+) *)?\n([\s\S]+?)\n?\1 *(?:\n *)+\n/),
    parse(capture, parse, state) {
      return {
        type: 'codeBlock',
        lang: capture[2] || undefined,
        content: capture[3],
      };
    },
    react: null,
    html: null,
  },
  list: {
    order: currOrder++,
    match(source, state) {
      // We only want to break into a list if we are at the start of a
      // line. This is to avoid parsing "hi * there" with "* there"
      // becoming a part of a list.
      // You might wonder, "but that's inline, so of course it wouldn't
      // start a list?". You would be correct! Except that some of our
      // lists can be inline, because they might be inside another list,
      // in which case we can parse with inline scope, but need to allow
      // nested lists inside this inline scope.
      const prevCaptureStr = state.prevCapture == null ? '' : state.prevCapture[0];
      const isStartOfLineCapture = LIST_LOOKBEHIND_R.exec(prevCaptureStr);
      // const isListBlock = state._list || !state.inline;

      // NOTE: && isListBlock check removed that it can parse list without second line break before
      if (isStartOfLineCapture) {
        source = isStartOfLineCapture[1] + source;

        return LIST_R.exec(source);
      }
      return null;
    },
    parse(capture, parse, state) {
      const bullet = capture[2];
      const ordered = bullet.length > 1;
      const start = ordered ? +bullet : undefined;
      const items = (
        capture[0]
          .replace(LIST_BLOCK_END_R, '\n')
          .match(LIST_ITEM_R)
      );

      // We know this will match here, because of how the regexes are
      // defined
      let lastItemWasAParagraph = false;
      const itemContent = items.map((item, i) => {
        // We need to see how far indented this item is:
        const prefixCapture = LIST_ITEM_PREFIX_R.exec(item);
        const space = prefixCapture ? prefixCapture[0].length : 0;
        // And then we construct a regex to "unindent" the subsequent
        // lines of the items by that amount:
        const spaceRegex = new RegExp(`^ {1,${space}}`, 'gm');

        // Before processing the item, we need a couple things
        const content = item
        // remove indents on trailing lines:
          .replace(spaceRegex, '')
        // remove the bullet:
          .replace(LIST_ITEM_PREFIX_R, '');

        // I'm not sur4 why this is necessary again?

        // Handling "loose" lists, like:
        //
        //  * this is wrapped in a paragraph
        //
        //  * as is this
        //
        //  * as is this
        const isLastItem = (i === items.length - 1);
        const containsBlocks = content.indexOf('\n\n') !== -1;

        // Any element in a list is a block if it contains multiple
        // newlines. The last element in the list can also be a block
        // if the previous item in the list was a block (this is
        // because non-last items in the list can end with \n\n, but
        // the last item can't, so we just "inherit" this property
        // from our previous element).
        const thisItemIsAParagraph = containsBlocks ||
                        (isLastItem && lastItemWasAParagraph);
        lastItemWasAParagraph = thisItemIsAParagraph;

        // backup our state for restoration afterwards. We're going to
        // want to set state._list to true, and state.inline depending
        // on our list's looseness.
        const oldStateInline = state.inline;
        const oldStateList = state._list;
        state._list = true;

        // Parse inline if we're in a tight list, or block if we're in
        // a loose list.
        let adjustedContent;
        if (thisItemIsAParagraph) {
          state.inline = false;
          adjustedContent = content.replace(LIST_ITEM_END_R, '\n\n');
        } else {
          state.inline = true;
          adjustedContent = content.replace(LIST_ITEM_END_R, '');
        }

        const result = parse(adjustedContent, state);

        // Restore our state before returning
        state.inline = oldStateInline;
        state._list = oldStateList;
        return result;
      });

      return {
        ordered,
        start,
        items: itemContent,
      };
    },
    react(node, output, state) {
      const ListWrapper = node.ordered ? 'ol' : 'ul';

      return reactElement(
        ListWrapper,
        state.key,
        {
          start: node.start,
          children: node.items.map((item, i) => reactElement(
            'li',
            `${i}`,
            {
              children: output(item, state),
            },
          )),
        },
      );
    },
    html(node, output, state) {
      const listItems = node.items.map(item => htmlTag('li', output(item, state))).join('');

      const listTag = node.ordered ? 'ol' : 'ul';
      const attributes = {
        start: node.start,
      };
      return htmlTag(listTag, listItems, attributes);
    },
  },
  newline: {
    order: currOrder++,
    match: blockRegex(/^(?:\n *)*\n/),
    parse: ignoreCapture,
    react(node, output, state) {
      return '\n';
    },
    html(node, output, state) {
      return '\n';
    },
  },
  paragraph: {
    order: currOrder++,
    match: blockRegex(/^((?:[^\n]|\n(?! *\n))+)(?:\n *)+\n/),
    parse: parseCaptureInline,
    react(node, output, state) {
      return reactElement(
        'p',
        state.key,
        {
          // className: 'paragraph',
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      const attributes = {
        class: 'paragraph',
      };
      return htmlTag('div', output(node.content, state), attributes);
    },
  },
  escape: {
    order: currOrder++,
    // We don't allow escaping numbers, letters, or spaces here so that
    // backslashes used in plain text still get rendered. But allowing
    // escaping anything else provides a very flexible escape mechanism,
    // regardless of how this grammar is extended.
    match: inlineRegex(/^\\([^0-9A-Za-z\s])/),
    parse(capture, parse, state) {
      return {
        type: 'text',
        content: capture[1],
      };
    },
    react: null,
    html: null,
  },
  em: {
    order: currOrder /* same as strong/u */,
    match: inlineRegex(
      new RegExp(
        // only match _s surrounding words.
        '^\\b_' +
                '((?:__|\\\\[\\s\\S]|[^\\\\_])+?)_' +
                '\\b' +
                // Or match *s:
                '|' +
                // Only match *s that are followed by a non-space:
                '^\\*(?=\\S)(' +
                // Match at least one of:
                '(?:' +
                  //  - `**`: so that bolds inside italics don't close the
                  //          italics
                  '\\*\\*|' +
                  //  - escape sequence: so escaped *s don't close us
                  '\\\\[\\s\\S]|' +
                  //  - whitespace: followed by a non-* (we don't
                  //          want ' *' to close an italics--it might
                  //          start a list)
                  '\\s+(?:\\\\[\\s\\S]|[^\\s\\*\\\\]|\\*\\*)|' +
                  //  - non-whitespace, non-*, non-backslash characters
                  '[^\\s\\*\\\\]' +
                ')+?' +
                // followed by a non-space, non-* then *
                ')\\*(?!\\*)',
      ),
    ),
    quality(capture) {
      // precedence by length, `em` wins ties:
      return capture[0].length + 0.2;
    },
    parse(capture, parse, state) {
      return {
        content: parse(capture[2] || capture[1], state),
      };
    },
    react(node, output, state) {
      return reactElement(
        'em',
        state.key,
        {
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      return htmlTag('em', output(node.content, state));
    },
  },
  strong: {
    order: currOrder /* same as em */,
    match: inlineRegex(/^\*\*((?:\\[\s\S]|[^\\])+?)\*\*(?!\*)/),
    quality(capture) {
      // precedence by length, wins ties vs `u`:
      return capture[0].length + 0.1;
    },
    parse: parseCaptureInline,
    react(node, output, state) {
      return reactElement(
        'strong',
        state.key,
        {
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      return htmlTag('strong', output(node.content, state));
    },
  },
  u: {
    order: currOrder++ /* same as em&strong; increment for next rule */,
    match: inlineRegex(/^__((?:\\[\s\S]|[^\\])+?)__(?!_)/),
    quality(capture) {
      // precedence by length, loses all ties
      return capture[0].length;
    },
    parse: parseCaptureInline,
    react(node, output, state) {
      return reactElement(
        'u',
        state.key,
        {
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      return htmlTag('u', output(node.content, state));
    },
  },
  del: {
    order: currOrder++,
    match: inlineRegex(/^~~(?=\S)((?:\\[\s\S]|~(?!~)|[^\s~]|\s(?!~~))+?)~~/),
    parse: parseCaptureInline,
    react(node, output, state) {
      return reactElement(
        'del',
        state.key,
        {
          children: output(node.content, state),
        },
      );
    },
    html(node, output, state) {
      return htmlTag('del', output(node.content, state));
    },
  },
  inlineCode: {
    order: currOrder++,
    match: inlineRegex(/^(`+)([\s\S]*?[^`])\1(?!`)/),
    parse(capture, parse, state) {
      return {
        content: capture[2].replace(INLINE_CODE_ESCAPE_BACKTICKS_R, '$1'),
      };
    },
    react(node, output, state) {
      return reactElement(
        'code',
        state.key,
        {
          children: node.content,
        },
      );
    },
    html(node, output, state) {
      return htmlTag('code', sanitizeText(node.content));
    },
  },
  br: {
    order: currOrder++,
    match: anyScopeRegex(/^ {2,}\n/),
    parse: ignoreCapture,
    react(node, output, state) {
      return reactElement(
        'br',
        state.key,
        EMPTY_PROPS,
      );
    },
    html(node, output, state) {
      return '<br>';
    },
  },
  text: {
    order: currOrder++,
    // Here we look for anything followed by non-symbols,
    // double newlines, or double-space-newlines
    // We break on any symbol characters so that this grammar
    // is easy to extend without needing to modify this regex
    match: anyScopeRegex(
      /^[\s\S]+?(?=[^0-9A-Za-z\s\u00c0-\uffff]|\n\n| {2,}\n|\w+:\S|$)/,
    ),
    parse(capture, parse, state) {
      return {
        content: capture[0],
      };
    },
    react(node, output, state) {
      return node.content;
    },
    html(node, output, state) {
      return sanitizeText(node.content);
    },
  },
};

const outputFor = (rules, property, defaultState) => {
  if (!property) {
    throw new Error('simple-markdown: outputFor: `property` must be ' +
            'defined. ' +
            'if you just upgraded, you probably need to replace `outputFor` ' +
            'with `reactFor`');
  }

  let latestState;
  const arrayRule = rules.Array || defaultRules.Array;

  // Tricks to convince tsc that this var is not null:
  const arrayRuleCheck = arrayRule[property];
  if (!arrayRuleCheck) {
    throw new Error(`simple-markdown: outputFor: to join nodes of type \`${
      property}\` you must provide an \`Array:\` joiner rule with that type, ` +
            'Please see the docs for details on specifying an Array rule.');
  }
  const arrayRuleOutput = arrayRuleCheck;

  const nestedOutput = (ast, state) => {
    state = state || latestState;
    latestState = state;
    if (Array.isArray(ast)) {
      return arrayRuleOutput(ast, nestedOutput, state);
    }
    return rules[ast.type][property](ast, nestedOutput, state);
  };

  const outerOutput = function (ast, state) {
    latestState = populateInitialState(state, defaultState);
    return nestedOutput(ast, latestState);
  };
  return outerOutput;
};

const defaultRawParse = parserFor(defaultRules);

const defaultBlockParse = function (source, state) {
  state = state || {};
  state.inline = false;
  return defaultRawParse(source, state);
};


const defaultReactOutput = outputFor(defaultRules, 'react');

const defaultHtmlOutput = outputFor(defaultRules, 'html');

export const markdownToReact = (source, state) => defaultReactOutput(defaultBlockParse(source, state), state);

export const markdownToHtml = (source, state) => defaultHtmlOutput(defaultBlockParse(source, state), state);
