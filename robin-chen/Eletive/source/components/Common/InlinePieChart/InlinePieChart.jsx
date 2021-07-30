import React from 'react';
import PropTypes from 'prop-types';

class InlinePieChart extends React.PureComponent {
  static propTypes = {
    diameter: PropTypes.number,
    strokeWidth: PropTypes.number,
    color: PropTypes.string,
    percentage: PropTypes.number.isRequired,
  }

  static defaultProps = {
    diameter: 20,
    strokeWidth: 3,
    color: '#4489fb',
  }

  render() {
    const { diameter, strokeWidth, color, percentage } = this.props;
    const completed = Math.max(0, Math.min(1, percentage));
    const cx = diameter / 2;
    const cy = diameter / 2;
    const r = (diameter - 2 * strokeWidth) / 2;
    const cir = 2 * Math.PI * r;
    const offset = (1 - completed) * cir;

    return (
      <svg width={diameter} height={diameter}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#f4f6fa"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={cir}
          style={{
            strokeDashoffset: offset,
            transformOrigin: 'center center',
            transform: 'rotate(-90deg)',
          }}
        />
      </svg>
    );
  }
}

export { InlinePieChart };
