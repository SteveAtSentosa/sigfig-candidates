import PropTypes from 'prop-types';

export function NameAbbreviation({ children }) {
  let abbreviation = '';

  const abbreviationWords = children
    .replace('[DEMO]', '')
    .replace(/[&_/\\|]/, '')
    .trim().split(' ');

  if (abbreviationWords.length < 2) {
    abbreviation = abbreviationWords[0].slice(0, 2);
  } else {
    abbreviation = abbreviationWords.map(word => word[0]).join('').slice(0, 2);
  }

  return abbreviation.toUpperCase();
}

NameAbbreviation.propTypes = {
  children: PropTypes.string,
};
