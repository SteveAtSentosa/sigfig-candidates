import PropTypes from 'prop-types';

import * as Models from 'Models';

export const ConditionalWrapper = ({ condition, wrapper, children }) => (
  condition ? wrapper(children) : children
);

ConditionalWrapper.propTypes = {
  wrapper: PropTypes.func,
  condition: PropTypes.bool,
  children: Models.Common.RenderableElement,
};
