import client from './client';

export const updateCurrentUser = (user) => {
  const query = `
    mutation UpdateMe($input: UpdateMe!) {
      updateMe(input: $input) {
        firstName, lastName, language
      }
    }
  `;

  return client.graphql(query, { input: user }).then(response => response.data.data.updateMe);
};

export const generateTwoFactorAuthSecretKey = () => {
  const query = `
    mutation generateMFASecret {
      generateMFASecret
    }
  `;

  return client.graphql(query).then(response => response.data.data.generateMFASecret);
};

export const enableTwoFactorAuth = (secret, token) => {
  const query = `
    mutation enableMFA($secret: String!, $token: Int!) {
      enableMFA(secret: $secret, token: $token)
    }
  `;

  return client.graphql(query, { secret, token }).then(response => response.data.data.enableMFA);
};

export const disableTwoFactorAuth = (userID) => {
  const query = `
    mutation dropMFA($id: Int) {
      dropMFA(id: $id)
    }
  `;

  return client.graphql(query, { id: userID }).then(response => response.data.data.dropMFA);
};
