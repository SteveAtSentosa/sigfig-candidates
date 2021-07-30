import _ from 'lodash';

export const buildRoute = (route, fields, query) => {
  let resultRoute = route;

  _.forEach(fields, (field, fieldName) => {
    resultRoute = resultRoute.replace(new RegExp(`:${fieldName}[?]?`), field);
  });

  if (_.endsWith(resultRoute, '/')) {
    resultRoute = resultRoute.substring(0, resultRoute.length - 1);
  }

  if (query) {
    resultRoute += `?${query}`;
  }

  return resultRoute;
};
