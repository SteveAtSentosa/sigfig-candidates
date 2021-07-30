import _ from 'lodash';
import produce from 'immer';

export const getUpdatedState = (object, path, value) => (
  produce(object, (draft) => {
    _.set(draft, path, value);
  })
);
