import { cognitoConfig } from './cognito-config';
import {apiEndpoint} from "./api-config";

export const environment = {
  production: true,
  cognito: cognitoConfig,
  apiEndpoint: apiEndpoint
};
