import { cognitoConfig } from './cognito-config';
import { apiEndpoint } from './api-config';

export const environment = {
  production: false,
  cognito: cognitoConfig,
  apiEndpoint: apiEndpoint,
};
