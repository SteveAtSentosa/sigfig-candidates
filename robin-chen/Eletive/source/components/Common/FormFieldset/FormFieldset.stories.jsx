import React from 'react';

import { FormFieldset } from 'Components/Common';

export default {
  title: 'Common|FormFieldset',

  parameters: {
    component: FormFieldset,
    componentSubtitle: 'Form fieldset with legend',
  },
};

export const normal = () => (
  <FormFieldset legendText="Place">
    <div>
      <label htmlFor="country">Country: <input id="country" /></label>
    </div>
    <div>
      <label htmlFor="city">City: <input id="city" /></label>
    </div>
  </FormFieldset>
);
