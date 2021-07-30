import _ from 'lodash';
import moment from 'moment';
import validator from 'validator';
import { store, actions } from 'store';

import { i18n } from 'utilities/decorators';

const fieldDic = {
  Email: {
    name: 'email',
    type: String,
  },
  email: {
    name: 'email',
    type: String,
  },
  'First name': {
    name: 'firstName',
    type: String,
  },
  firstName: {
    name: 'firstName',
    type: String,
  },
  'Last name': {
    name: 'lastName',
    type: String,
  },
  lastName: {
    name: 'lastName',
    type: String,
  },
  Language: {
    name: 'language',
    type: String,
  },
  language: {
    name: 'language',
    type: String,
  },
};

const findSegmentsToAdd = (usersData) => {
  const {
    attributes: { attributeList },
  } = store.getState();
  const segmentsToAdd = [];
  const importMessages = [];

  usersData.forEach(user => user.attributes.forEach((attribute) => {
    if (attribute.addSegment) {
      const itemSegmentsToAdd = segmentsToAdd.find(item => item.attribute.id === attribute.id);
      if (!itemSegmentsToAdd) {
        segmentsToAdd.push({
          attribute,
          segments: [attribute.addSegment],
        });
      } else if (itemSegmentsToAdd.segments.indexOf(attribute.addSegment) === -1) {
        itemSegmentsToAdd.segments.push(attribute.addSegment);
      }
    }
  }));

  segmentsToAdd.forEach((item) => {
    const attribute = attributeList.find(attr => attr.id === item.attribute.id);
    const segments = item.segments.join("','");

    importMessages.push(
      `${i18n.global('BatchCreateUsers.Errors.NEED_ADD_SEGMENTS')} '${attribute.name}' -> '${segments}'`,
    );
  });

  return { segmentsToAdd, importMessages };
};

const processReadedData = (readedData) => {
  if (!readedData.length || readedData.length < 2) {
    return 'Errors.NO_DATA_IN_FILE';
  }

  if (!readedData[readedData.length - 1].length
    || (readedData[readedData.length - 1].length === 1 && !readedData[readedData.length - 1][0])) {
    readedData.splice(-1, 1);
  }

  const {
    attributes: { attributeList },
    users: { userList },
  } = store.getState();

  const selectedOrganization = store.dispatch(actions.app.getSelectedOrganization());

  const importMessages = [];
  const unknownCollumns = [];

  const readedDataFields = readedData[0].map((field, index) => {
    if (!field.trim()) {
      importMessages.push(`${i18n.global('BatchCreateUsers.Errors.UNNAMED_COLUMN')} #${index + 1}`);
      return null;
    }
    if (fieldDic[field.trim()]) {
      return fieldDic[field.trim()];
    }
    const attribute = attributeList.find(attr => attr.name === field.trim());
    if (attribute) {
      return { attribute };
    }
    unknownCollumns.push(field);
    return null;
  }).map((field, index, allFields) => {
    if (field && allFields
      .findIndex(e => (e && e.name && e.name === field.name)
        || (e && e.attribute && field.attribute && e.attribute.id === field.attribute.id)) !== index) {
      importMessages.push(`${i18n.global('BatchCreateUsers.Errors.DUPLICATE_COLUMN')} #${index + 1}`);
      return null;
    }
    return field;
  });

  if (!readedDataFields.find(field => field && field.name === 'email')) {
    return 'Errors.WRONG_EMAIL';
  }
  if (readedDataFields.filter(field => field).length < 2) {
    return 'Errors.NOTHING_TO_IMPORT';
  }

  if (unknownCollumns.length) {
    importMessages.push(i18n.global('BatchCreateUsers.Errors.UNKNOWN_COLUMNS',
      { columns: unknownCollumns.join('\', \'') }));
  }

  readedData.splice(0, 1);

  let countAddUsers = 0;
  const skippedData = [];
  const readedRowEmail = {};
  const duplicateUsers = [];
  const readedRowsCount = readedData.length;
  const usersData = readedData.map((row, rowIndex) => {
    if (!row.length || (row.length === 1 && !row[0])) {
      skippedData.push({ row: rowIndex + 1, email: '', error: 'EMPTY_ROW' });
      return null;
    }
    const user = { attributes: [] };
    try {
      readedDataFields.forEach((field, index) => {
        if (!field) {
          return;
        }
        if (field.name && row[index]) {
          if (row[index].trim()) {
            user[field.name] = field.type(row[index].trim());
          }
          if (field.name === 'email') {
            user.email = user.email.toLowerCase();
            if (!user.email || !validator.isEmail(user.email)) {
              throw new Error('WRONG_EMAIL');
            }
            if (user.email === 'examplename.exlastname@eletive.com') {
              throw new Error('EXAMPLE_EMAIL');
            }
          }
        } else if (field.attribute && row[index]) {
          const attribute = attributeList.find(attr => attr.id === field.attribute.id);
          const { segments } = attribute;
          let value;
          let addSegment;
          if (attribute.type === 0) {
            const fieldPrepared = row[index].trim().replace(/[<>]/g, '');
            const segment = segments.find(({ name }) => name === fieldPrepared);
            if (segment) {
              ({ value } = segment);
            } else {
              addSegment = fieldPrepared;
            }
          } else if (attribute.type === 1) {
            const date = moment(row[index]);
            if (!date.isValid()) {
              throw new Error(`Error [${field.attribute.name}]: ${i18n.global('BatchCreateUsers.Errors.NOT_A_DATE')}`);
            }
            value = Math.floor(date.unix());
          } else if (attribute.type === 2) {
            value = Number(row[index].replace(',', '.'));
            if (_.isNaN(value)) {
              throw new Error(
                `Error [${field.attribute.name}]: ${i18n.global('BatchCreateUsers.Errors.NOT_A_NUMBER')}`,
              );
            }
          }
          user.attributes.push({ id: attribute.id, value, addSegment });
        }
      });
    } catch (err) {
      if (err.message) {
        skippedData.push({ row: rowIndex + 1, email: user.email || '', error: err.message });
      } else {
        skippedData.push({ row: rowIndex + 1, email: user.email || '', error: 'CONVERTING_DATA' });
      }
      return null;
    }

    if (readedRowEmail[user.email] || duplicateUsers.indexOf(user.email) !== -1) {
      skippedData.push({ row: rowIndex + 1, email: user.email, error: 'USER_DUPLICATE' });
      if (readedRowEmail[user.email]) {
        skippedData.push({ row: readedRowEmail[user.email], email: user.email, error: 'USER_DUPLICATE' });
        duplicateUsers.push(user.email);
        delete readedRowEmail[user.email];
      }
      return null;
    }

    readedRowEmail[user.email] = rowIndex + 1;

    if (!userList.find(userItem => user.email === userItem.email)) {
      countAddUsers += 1;
      if (selectedOrganization.maxUserCount !== null
        && (countAddUsers + userList.length) >= selectedOrganization.maxUserCount) {
        skippedData.push({ row: rowIndex + 1, email: user.email || '', error: 'MAX_USER_COUNT' });
        return null;
      }
    }
    return user;
  })
    .filter(user => user && duplicateUsers.indexOf(user.email) === -1);

  const { segmentsToAdd, importMessages: addImportMessages } = findSegmentsToAdd(usersData);
  importMessages.push(...addImportMessages);

  return {
    usersData,
    readedRowEmail,
    readedRowsCount,
    resultErrors: skippedData,
    importMessages,
    segmentsToAdd,
  };
};


export {
  processReadedData,
};
