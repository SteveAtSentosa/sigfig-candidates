import React from 'react';
import PropTypes from 'prop-types';

import * as Own from './RateMeter.Components';

const ratingScoreChecker = (props, propName, component) => {
  if (!(propName in props)) {
    return new Error(`Missing '${propName}' prop for ${component}.`);
  }
  const { [propName]: value } = props;
  const type = typeof value;

  if (value !== null && type !== 'number') {
    return new Error(`'${propName}' prop for ${component} must be an integer or null.`);
  }

  if (type === 'number') {
    const rating = props.ratings[value];
    if (!rating) {
      return new Error(
        `'${propName}' value that was given (${value}) has to be
        indexable into the 'ratings' prop array, it's out of bounds.`,
      );
    }
  }
  return null;
};

class RateMeter extends React.Component {
  static propTypes = {
    ratings: PropTypes.array.isRequired,
    ratingScore: ratingScoreChecker,
    emptyRatingColor: PropTypes.string,
    noRatingLabel: PropTypes.string,
  }

  static defaultProps = {
    emptyRatingColor: '#c9d0db',
    noRatingLabel: '',
  };

  getScoredRating() {
    const { ratings, ratingScore, emptyRatingColor, noRatingLabel } = this.props;
    const rating = ratings[ratingScore];
    return rating || { color: emptyRatingColor, label: noRatingLabel };
  }

  renderRatingItem(color, index) {
    return <Own.RatingItem key={index} color={color} />;
  }

  renderRatingItems(scoredRating) {
    const { ratings, ratingScore, emptyRatingColor } = this.props;
    return ratings.map((rating, index) => {
      const color = (index <= ratingScore) ? scoredRating.color : emptyRatingColor;
      return this.renderRatingItem(color, index);
    });
  }

  render() {
    const scoredRating = this.getScoredRating();
    const ratingNodes = this.renderRatingItems(scoredRating);
    return (
      <Own.Container>
        <Own.RatingItems>
          {ratingNodes}
        </Own.RatingItems>
        <Own.Label>{scoredRating.label}</Own.Label>
      </Own.Container>
    );
  }
}

export { RateMeter };
