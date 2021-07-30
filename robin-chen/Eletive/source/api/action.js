import _ from 'lodash';
import client from './client';

const queris = {
  fetchObjectiveList: (organization, driver) => `{
    Objectives${client.getArgs({ organization, driver })} {
      page, totalCount, pageLimit, items {
        id name description startAt endAt isPublic organization parent subject 
        subjectType driver status createdAt isWriteAccess
        objectiveKeys {
          name type currency value minValue maxValue
        }
      }
    }
  }`,
};

export const createObjective = (objective) => {
  const request = `
    mutation addObjective($input: AddObjective!) {
      addObjective(input: $input) {
        id name description startAt endAt isPublic organization parent subject 
        subjectType driver status createdAt isWriteAccess
        objectiveKeys {
          name type currency value minValue maxValue
        }
      }
    }
  `;

  return client.graphql(request, { input: objective })
    .then(response => response.data.data.addObjective);
};

export const updateObjective = (objective) => {
  const request = `
    mutation UpdateObjective($id: Int!, $input: UpdateObjective!) {
      updateObjective(id: $id, input: $input) {
        id name description startAt endAt isPublic organization parent subject 
        subjectType driver status createdAt isWriteAccess
        objectiveKeys {
          name type currency value minValue maxValue
        }
      }
    }
  `;

  const data = {
    id: objective.id,
    input: { ..._.omit(objective, ['id', 'organization', 'subject', 'subjectType', 'createdAt', 'isWriteAccess']) },
  };

  return client.graphql(request, data)
    .then(response => response.data.data.updateObjective);
};

export const deleteObjective = ({ id }) => {
  const request = `
    mutation deleteObjective($id: Int!) {
      deleteObjective(id: $id)
    }
  `;

  return client.graphql(request, { id });
};

export const fetchObjectiveList = (organization, driver) => {
  const query = queris.fetchObjectiveList(organization, driver);

  return client.graphql(query)
    .then(response => response.data.data.Objectives.items);
};
