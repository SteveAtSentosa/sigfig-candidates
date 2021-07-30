import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Classes } from '@blueprintjs/core';

import classes from './NoData.scss';

export function NoData({ text, link, className }) {
  const componentClasses = classnames(classes.noData, className, Classes.TEXT_MUTED);

  return (
    <div className={componentClasses}>
      {text}
      {'. '}
      {link}
    </div>
  );
}

NoData.propTypes = {
  text: PropTypes.node,
  link: PropTypes.node,
  className: PropTypes.string,
};

NoData.defaultProps = {
  className: '',
};
