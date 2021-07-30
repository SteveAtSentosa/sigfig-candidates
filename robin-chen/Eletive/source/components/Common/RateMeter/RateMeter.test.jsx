import React from 'react';
import { shallow } from 'enzyme';
import 'jest-styled-components';

import { RateMeter } from 'Components/Common';
import { RatingItem, Label } from './RateMeter.Components';

describe('RateMeter', () => {
  const ratings = [
    { color: '#a83232', label: 'Very Weak' },
    { color: '#a86532', label: 'Weak' },
    { color: '#9aa832', label: 'Good' },
    { color: '#85a832', label: 'Better' },
    { color: '#38a832', label: 'Awesome' },
  ];

  it('renders a rating item for each element in the ratings array', () => {
    const component = shallow(
      <RateMeter ratings={ratings} ratingScore={1} />,
    );
    expect(component.find(RatingItem)).toHaveLength(ratings.length);
  });

  it('has the correct label text for the rating score', () => {
    const score = 3;
    const component = shallow(
      <RateMeter ratings={ratings} ratingScore={score} />,
    );
    expect(component.find(Label).text()).toBe(ratings[score].label);
  });

  it('has the correct colors for the rating items', () => {
    const score = 2;
    const { color } = ratings[score];
    const emptyRatingColor = '#000';

    const component = shallow(
      <RateMeter ratings={ratings} ratingScore={score} emptyRatingColor={emptyRatingColor} />,
    );

    const ratingsItems = component.find(RatingItem);
    expect(ratingsItems.at(0)).toHaveStyleRule('background-color', color);
    expect(ratingsItems.at(1)).toHaveStyleRule('background-color', color);
    expect(ratingsItems.at(2)).toHaveStyleRule('background-color', color);
    expect(ratingsItems.at(3)).toHaveStyleRule('background-color', emptyRatingColor);
    expect(ratingsItems.at(4)).toHaveStyleRule('background-color', emptyRatingColor);
  });
});
