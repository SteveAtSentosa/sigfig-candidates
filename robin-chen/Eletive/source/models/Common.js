import _ from 'lodash';
import { any, string, shape, number, node, object, func, oneOf, arrayOf, oneOfType, bool } from 'prop-types';

import { Locales } from 'Constants';

export const Ref = any;

export const Intent = oneOf(['none', 'danger', 'primary', 'success', 'warning']);

export const Language = oneOf(_.keys(Locales));
export const LanguageList = arrayOf(Language);

export const I18Content = shape(
  _.assign({}, ..._.map(Locales, (localeName, localeCode) => ({
    [localeCode]: string,
  }))),
);

const RequestStatusFlag = oneOf(['', 'pending', 'success', 'failure']);

export const RequestStatus = oneOfType([
  RequestStatusFlag,
  shape({
    status: RequestStatusFlag.isRequired,
  }),
]);

export const Notification = shape({
  id: string.isRequired,
  icon: string,
  intent: string,
  timeout: number,
  message: string.isRequired,
});

export const NotificationList = arrayOf(Notification);

export const RenderableElement = oneOfType([arrayOf(node), node, func]);

export const Breadcrumb = shape({
  name: string,
  route: string,
});

export const BreadcrumbList = arrayOf(Breadcrumb);

export const SortableTableColumn = shape({
  key: string.isRequired,
  title: string.isRequired,
  style: object,
  sortable: oneOfType([bool, func, arrayOf(func)]),
});

export const SortableTableColumns = arrayOf(SortableTableColumn);

export const AlertAction = shape({
  disabled: bool,
  text: string,
  intent: string,
  onClick: func,
});

export const AlertActions = arrayOf(AlertAction);
