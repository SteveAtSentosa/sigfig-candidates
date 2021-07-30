import React from 'react';

import { TimezonePicker } from './TimezonePicker';

export default {
  title: 'Common|TimezonePicker',
  parameters: {
    component: TimezonePicker,
    componentSubtitle: 'Timezone Picker',
  },
};

const props = {
  onChange: () => {},
  value: {
    abbreviation: 'GMT',
    offset: 0,
    offsetAsString: '+00:00',
    timezone: 'Europe/London',
    key: 'Europe/London',
    text: 'Europe/London (GMT)',
  },
};

export const normal = () => (
  <TimezonePicker {...props} />
);
