import moment from 'moment';
import jwtdecode from 'jwt-decode';

function isTokenExpired({ exp }) {
  const expirationDate = moment.unix(exp);
  return moment().isAfter(expirationDate);
}

export const isFullAccessToken = (tokenString) => {
  try {
    const token = jwtdecode(tokenString);
    return !token.typ;
  } catch (e) {
    return false;
  }
};

export const validateToken = (tokenString) => {
  try {
    const token = jwtdecode(tokenString);
    return isTokenExpired(token) === false;
  } catch (e) {
    return false;
  }
};

/**
 * Returns the best token from a given list of tokens.
 * Token is supposed to be the best if it has more rights and
 * a newer creation date. It also checks if tokens belong
 * to the same user
 * @param {Array} tokens - list of tokens.
 */
export const chooseBestToken = (tokens) => {
  let chosenToken = null;
  let chosenDecoded = null;

  tokens.forEach((token) => {
    if (validateToken(token)) {
      const decodedToken = jwtdecode(token);
      if (!chosenToken) {
        chosenToken = token;
        chosenDecoded = decodedToken;
      } else {
        const isTheSameUser = decodedToken.id === chosenDecoded.id;
        const isFullAccess = !decodedToken.typ && chosenDecoded.typ;
        const isNewToken = decodedToken.iat > chosenDecoded.iat;
        const isBetterToken = isFullAccess || isNewToken;

        if (isTheSameUser && isBetterToken) {
          chosenToken = token;
          chosenDecoded = decodedToken;
        }
      }
    }
  });

  return chosenToken;
};
