import _ from 'lodash';
import client from './client';
import errorHandlers from './errorHandlers';

export const queries = {
  fetchAttributeList: organization => `{
    Attributes${client.getArgs({ organization })} {
      page, totalCount, pageLimit, items {
        ${queries.attributeModelQuery}
      }
    }
  }`,

  attributeModelQuery: `
    id,
    name,
    type,
    organization,
    reportToMembers,
    allowAsFilterInReport,
    segments {
      name, value, valueUpTo, userCount, managers, childSegments, managersCount
    }
  `,
};

export function fetchAttributeList(organizationID = null) {
  const query = queries.fetchAttributeList(organizationID);

  return client.graphql(query)
    .then(response => response.data.data.Attributes.items);
}

export function createAttribute(attribute) {
  const request = `
    mutation addAttribute($input: AddAttribute!) {
      addAttribute(input: $input) {
        ${queries.attributeModelQuery}
      }
    }
  `;

  return client.graphql(request, { input: attribute }, errorHandlers.attributesErrorHandler)
    .then(response => response.data.data.addAttribute);
}

export function updateAttribute(attribute) {
  const attributeModel = {
    ..._.pick(attribute, ['name', 'reportToMembers', 'segments', 'allowAsFilterInReport']),
  };

  attributeModel.segments = attribute.segments.map(item => ({
    ..._.pick(item, ['name', 'value', 'valueUpTo', 'childSegments']),
  }));

  const request = `
    mutation updateAttribute($id: Int!, $input: UpdateAttribute!) {
      updateAttribute(id: $id, input: $input) {
        ${queries.attributeModelQuery}
      }
    }`;

  const data = {
    id: attribute.id,
    input: attributeModel,
  };

  return client.graphql(request, data, errorHandlers.attributesErrorHandler)
    .then(response => response.data.data.updateAttribute);
}

export function deleteAttribute(attributeID) {
  const request = `
    mutation DeleteAttribute($id: Int!) {
      deleteAttribute(id: $id)
    }
  `;

  return client.graphql(request, { id: attributeID });
}

export function addSegmentManager(userID, attributeID, segmentID) {
  const request = `
    mutation AddSegmentManager($input: AddSegmentManager!) {
      addSegmentManager(input: $input)
    }
  `;

  const input = {
    user: userID,
    segment: segmentID,
    attribute: attributeID,
  };

  return client.graphql(request, { input }).then(response => response.data.data.addSegmentManager);
}

export function deleteSegmentManager(userID, segmentID) {
  const request = `
    mutation DeleteSegmentManager($user: Int!, $segment: SegmentIDType!) {
      deleteSegmentManager(user: $user, segment: $segment)
    }
  `;

  return client.graphql(request, { user: userID, segment: segmentID })
    .then(response => response.data.data.deleteSegmentManager);
}
