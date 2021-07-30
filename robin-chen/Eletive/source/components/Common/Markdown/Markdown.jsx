import * as React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import { markdownToReact } from './Markdown.service';

export class Markdown extends React.PureComponent {
  static propTypes = {
    source: PropTypes.string,
  }

  render() {
    const { source } = this.props;
    return markdownToReact(source);
  }
}

const Content = ({ className, source }) => (
  <div className={className}>
    <Markdown source={source} />
  </div>
);

export const MarkdownContent = styled(Content)`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 26px;
  color: #98a6bc;

  strong {
    font-weight: 900;
  }

  @media screen and (max-width: 768px) {
    ul {
      padding-left: 20px;
    }
  }
`;
