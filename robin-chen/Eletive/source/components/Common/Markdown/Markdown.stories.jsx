import React from 'react';

import { Markdown } from './Markdown';


export default {
  title: 'Common|Markdown',
  parameters: {
    component: Markdown,
    componentSubtitle: 'Pretty simple markdown parser. No sanitize (not needed).',
  },
};

const markdownText = `
# Title

Some text with **bold**,  *italic* and ***both***

text on new line

\`\`\`js
some code
  with
   spacing
\`\`\`

## List

* list item 1
  - list item 2
    + list item 3
* list item 5

## Num list

1. list item 1
2. list item 2
3. list item 3

---

~~del~~

\\#escaping\\^symbols\\*
`;

const notAllowedMD = `
## Links

[Link](http)


## Tables

| Feature   | Support |
| --------- | ------- |
| tables    | ✔ |
| alignment | ✔ |
| wewt      | ✔ |

## HTML block

<blockquote>
  This blockquote will change based on the HTML settings above.
</blockquote>

> blockquote

`;

const questionMd = `
I have been ***free from*** most of the following early signs of stress during the past four weeks:
- Headache, or pain in muscles or joints
- Irritation and lack of patience
- Concentration difficulties and mental fatigue
- Impaired memory
- Increased sensitivity to sound, light or touch
- Fatigue or sleep problems
`;


export const normal = () => (
  <Markdown
    source={markdownText}
  />
);


export const notAllowed = () => (
  <Markdown
    source={notAllowedMD}
  />
);

export const question = () => (
  <Markdown
    source={questionMd}
  />
);
