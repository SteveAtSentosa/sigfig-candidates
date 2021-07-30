import _ from 'lodash';
import PropTypes from 'prop-types';

export const MaybeElement = ({ condition, children, placeholder }) => (
  _.isNil(condition) === false ? children : placeholder
);

MaybeElement.propTypes = {
  condition: PropTypes.any,
  children: PropTypes.node,
  placeholder: PropTypes.node,
};

MaybeElement.defaultProps = {
  placeholder: 'N/A',
};
