import React from 'react';
import { shallow } from 'enzyme';

import { FormActions, RoundedButtonIntent } from 'Components/Common';

describe('FormActions', () => {
  it('is defined', () => {
    const actions = [
      {
        text: 'Cancel',
        onClick: () => {},
      },
      {
        text: 'Create',
        intent: RoundedButtonIntent.SUCCESS,
        onClick: () => {},
      },
    ];

    const component = shallow(
      <FormActions
        actions={actions}
        actionText="Create"
        cancelText="Cancel"
        handleAction={() => {}}
        handleCancel={() => {}}
      />,
    );
    expect(component).toBeDefined();
  });
});
