import { func, shape, string, arrayOf } from 'prop-types';

export const Route = shape({
  icon: func,
  path: string.isRequired,
  component: func.isRequired,
});

export const RouteList = arrayOf(Route);
