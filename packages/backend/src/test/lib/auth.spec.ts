import { expect, jest, it, describe } from '@jest/globals';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import { APIGatewayProxyEvent, APIGatewayRequestAuthorizerEvent } from 'aws-lambda';
import { getAuthHeader, getTokenQueryParam, validateCognitoJwt } from '../../lib/auth';
import {EnvVarNames} from "../../lib/enum";

jest.mock('aws-jwt-verify');

describe('validateCognitoJwt', () => {
  const mockVerifier: { verify: any } = {
    verify: jest.fn(),
  };

  beforeEach(() => {
    (CognitoJwtVerifier.create as jest.Mock).mockReturnValue(mockVerifier);
    process.env[EnvVarNames.COGNITO_USER_POOL_ID] = 'test'
    process.env[EnvVarNames.COGNITO_CLIENT_ID] = 'test'
  });

  it('should return payload if JWT is valid', async () => {
    const mockJwt = 'valid-jwt';
    const mockPayload = { sub: '12345' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    mockVerifier.verify.mockResolvedValue(mockPayload);

    const result = await validateCognitoJwt(mockJwt, 'id');
    expect(result).toEqual(mockPayload);
  });

  it('should return null if JWT verification fails', async () => {
    const mockJwt = 'invalid-jwt';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    mockVerifier.verify.mockRejectedValue(new Error('Verification failed'));

    const result = await validateCognitoJwt(mockJwt, 'id');

    expect(result).toBeNull();
  });
});

describe('getAuthHeader', () => {
  it('should return the Authorization header if it exists', () => {
    const event: APIGatewayProxyEvent = {
      headers: {
        Authorization: 'Bearer mock-token',
      },
    } as any;

    const result = getAuthHeader(event);

    expect(result).toBe('Bearer mock-token');
  });

  it('should return undefined if Authorization header does not exist', () => {
    const event: APIGatewayProxyEvent = {
      headers: {},
    } as any;

    const result = getAuthHeader(event);

    expect(result).toBeUndefined();
  });

  it('should return undefined if headers are not provided', () => {
    const event: APIGatewayProxyEvent = {} as any;

    const result = getAuthHeader(event);

    expect(result).toBeUndefined();
  });
});

describe('getTokenQueryParam', () => {
  it('should return the token query parameter if it exists', () => {
    const event: APIGatewayRequestAuthorizerEvent = {
      queryStringParameters: {
        token: 'mock-token',
      },
    } as any;

    const result = getTokenQueryParam(event);

    expect(result).toBe('mock-token');
  });

  it('should return undefined if token query parameter does not exist', () => {
    const event: APIGatewayRequestAuthorizerEvent = {
      queryStringParameters: {},
    } as any;

    const result = getTokenQueryParam(event);

    expect(result).toBeUndefined();
  });

  it('should return undefined if queryStringParameters are not provided', () => {
    const event: APIGatewayRequestAuthorizerEvent = {} as any;

    const result = getTokenQueryParam(event);

    expect(result).toBeUndefined();
  });
});
