import React from 'react';
import PropTypes from 'prop-types';

import * as Own from './Line.Components';

const Line = ({ marginTop, marginBottom }) => (
  <Own.LineDiv marginTop={marginTop} marginBottom={marginBottom} />
);

Line.propTypes = {
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
};

Line.defaultProps = {
  marginTop: 0,
  marginBottom: 0,
};

export { Line };
