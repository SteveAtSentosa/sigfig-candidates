import React from 'react';
import { Provider } from 'react-redux';
import { store } from 'store';

import { SortableTable } from './SortableTable';

export default {
  title: 'Common|SortableTable',
  parameters: {
    component: SortableTable,
  },
};

export const normal = () => (
  <Provider store={store}>
    <SortableTable
      keyField="id"
      columns={[
        {
          key: 'name',
          title: 'Name',
          style: { width: '40%' },
          sortable: (a, b, mode) => (mode * (a.name > b.name ? 1 : -1)),
        },
        {
          key: 'last_date',
          title: 'Last Date',
          style: { width: '25%' },
        },
        {
          key: 'next_date',
          title: 'Next Date',
          style: { width: '25%' },
        },
      ]}
      items={[
        {
          id: 1,
          name: 'John Doe',
          last_date: 'Oct 21, 2019',
          next_date: 'Oct 21, 2019',
        },
        {
          id: 2,
          name: 'Jane Doe',
          last_date: 'Oct 21, 2020',
          next_date: 'Oct 21, 2020',
        },
      ]}
    />
  </Provider>
);
