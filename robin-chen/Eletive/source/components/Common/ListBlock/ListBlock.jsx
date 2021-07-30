import React from 'react';
import PropTypes from 'prop-types';

import * as Models from 'Models';

import { Label } from 'Components/Common';
import { listIcon } from 'images/icons/common';

import * as Own from './ListBlock.Components';

export class ListBlock extends React.PureComponent {
  static propTypes = {
    required: PropTypes.bool,
    label: PropTypes.string,
    emptyIcon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    emptyText: PropTypes.string,
    emptyAction: PropTypes.node,
    headerAction: PropTypes.node,
    children: Models.Common.RenderableElement,
  }

  static defaultProps = {
    emptyIcon: listIcon,
  };

  get isEmpty() {
    const { children } = this.props;
    if (Array.isArray(children)) {
      return !children.some(e => !!e);
    }
    return !children;
  }

  renderEmpty = () => {
    const { emptyIcon, emptyText, emptyAction } = this.props;
    return (
      <>
        {typeof emptyIcon === 'string'
          ? <Own.EmptyIcon source={emptyIcon} />
          : emptyIcon
        }
        {emptyText &&
        <Own.EmptyText>{emptyText}</Own.EmptyText>
        }
        {emptyAction}
      </>
    );
  }

  renderHeader = () => {
    const { label, headerAction, required } = this.props;
    if (!label && !headerAction) {
      return null;
    }
    return (
      <Own.HeaderContainer>
        {label &&
        <Label inline label={label} required={required} />
        }
        {headerAction}
      </Own.HeaderContainer>
    );
  }

  render() {
    const { children } = this.props;
    return (
      <>
        {this.renderHeader()}
        <Own.ListContainer>
          {this.isEmpty
            ? this.renderEmpty()
            : children
          }
        </Own.ListContainer>
      </>
    );
  }
}
