import {
  percent,
  currency,
  number,
  complete,
} from 'images/actions/types';

import Types from 'Constants/Actions';

const KeyResultTypes = [
  {
    name: 'Percent',
    type: Types.KeyResultTypes.Percent,
    icon: percent,
  },
  {
    name: 'Currency',
    type: Types.KeyResultTypes.Currency,
    icon: currency,
  },
  {
    name: 'Number',
    type: Types.KeyResultTypes.Number,
    icon: number,
  },
  {
    name: 'Complete',
    type: Types.KeyResultTypes.Binary,
    icon: complete,
  },
];

export { KeyResultTypes };
