import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

// TODO: fix this
// eslint-disable-next-line no-unused-vars
import { store } from 'store';
import * as api from 'api/attributes';

import { createAttribute } from './attributes.actions';

const mockStore = configureStore([thunk]);

describe('attributes actions', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createAttribute action', () => {
    it('creates attribute with "allowAsFilterInReport" field default value', () => {
      const organizationList = [
        {
          id: 0,
        },
      ];

      const initialState = {
        app: {
          selectedOrganizationID: organizationList[0].id,
        },
        organizations: {
          organizationList,
        },
      };

      const mockedStore = mockStore(initialState);

      const mockedCreateAttributeAPIFunction = jest
        .spyOn(api, 'createAttribute')
        .mockImplementation(() => Promise.resolve());

      mockedStore.dispatch(createAttribute(0, 'test attribute name'));
      expect(mockedCreateAttributeAPIFunction).toHaveBeenCalledWith(expect.objectContaining({
        allowAsFilterInReport: false,
      }));

      mockedStore.dispatch(createAttribute(1, 'test attribute name'));
      expect(mockedCreateAttributeAPIFunction).toHaveBeenCalledWith(expect.objectContaining({
        allowAsFilterInReport: true,
      }));

      mockedStore.dispatch(createAttribute(2, 'test attribute name'));
      expect(mockedCreateAttributeAPIFunction).toHaveBeenCalledWith(expect.objectContaining({
        allowAsFilterInReport: true,
      }));
    });
  });
});
