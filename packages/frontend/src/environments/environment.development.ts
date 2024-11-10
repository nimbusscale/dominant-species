import { cognitoConfig } from './cognito-config';
import { apiEndpoint, stateEndpoint } from './api-config';

export const environment = {
  production: false,
  cognito: cognitoConfig,
  apiEndpoint: apiEndpoint,
  stateEndpoint: stateEndpoint,
};
