import {expect, jest, it, describe} from '@jest/globals';
import {ApiRequest, ApiRequestHandler, ApiRoute} from "../../../lib/api/request-handling";
import {ApiResponseType} from "api-types/src/request-response";
import {GameCollection} from "api-types/src/game";
import {APIGatewayProxyEvent} from "aws-lambda";
import {StatusCodes} from "http-status-codes";
import {BadRequestError} from "../../../lib/error";


const testJwt = 'eyJraWQiOiIxdU1KcXN4SzBoV1FMNGN4OFVWZ2hCUnQybzJ6alhpSmhOcEhLeGdhZ0VjPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJhMWJiYTUzMC0yMDIxLTcwYmUtNDk1Yy1iYzk5NzAyZTBhY2QiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMi5hbWF6b25hd3MuY29tXC91cy1lYXN0LTJfTlM5Z3lyS3dnIiwiY29nbml0bzp1c2VybmFtZSI6Imh1bWFubnVtYmVyMSIsIm9yaWdpbl9qdGkiOiIzNjg1YzI4Mi1hNGY5LTRmOTMtOGU1NC1hYjIxYWNmNTcwMzEiLCJhdWQiOiI1YnA0OHE3N3Y3azJzMHBla3JtbzJxdjVhYyIsImV2ZW50X2lkIjoiNGJmNmY1N2MtOTU5MC00MjQ1LTk3MDgtYTA0OWUyMDQxYWVhIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE3Mjk5NDY1NDYsImV4cCI6MTcyOTk4OTc0NiwiaWF0IjoxNzI5OTQ2NTQ2LCJqdGkiOiI2OWVlMzc0Ny04MDhjLTQzYTEtYjE2ZS1kNTZhODY4MGZiZWIiLCJlbWFpbCI6ImpvZUBqamszLmNvbSJ9.doukf7I5TSuysPRYsEFNEj7N8TXKZoVT7JyJWvgSzkyaZJCEmQlVue6WnVqwQawvmUijyeDFGCf-aIs5kY1PxG9cpVv-KvXVWj6YzcQqKlW3pcLkxx0IbJQ4B2rDRuMlVf2UUaAcxfqel-VbztwRhQy0mjwVkLvfMMmtJB3IS1cxZgEHsd_msoNpN4_H9p7oU3d7FwdWDAlSWd1nE-KqqRZbpWfyE9drU8ix8IFJyaRCjpQL0S-D_cj7672NI4tPFjcRFgj2vlfJ8KWO1vu9irCzydNzqJHVhXKEZrn_AKg-te-Prs9aTezIZPdzAEH09hyT7UMfRfPauWDAhCTQ9Q'

describe('ApiRequestHandler', () => {
  beforeEach(() => {
  console.error = jest.fn()
  })

  it('Should return OK if known route', async() => {
    const testResponse: GameCollection = {games: []}
    const mockHandler = jest.fn(async (): Promise<ApiResponseType> => {
      return Promise.resolve(testResponse)
    }) as (apiRequest: ApiRequest) => Promise<ApiResponseType>;

    const routes: ApiRoute[] = [
      {
        method: 'GET',
        pattern: /^\/v1\/game$/,
        handler: mockHandler,
      },
    ];

    const apiRequestHandler = new ApiRequestHandler(routes);
    const testApiEvent: Partial<APIGatewayProxyEvent> = {
      httpMethod: 'GET',
      path: '/v1/game',
      queryStringParameters: {username: 'tester1'},
      headers: {Authorization: testJwt},
    }
    const apiResponse = await apiRequestHandler.handleApiEvent(testApiEvent as APIGatewayProxyEvent)
    expect(apiResponse).toEqual({statusCode: StatusCodes.OK, body: JSON.stringify(testResponse)})
  });
  it('Should return Not Found if unknown route', async() => {
    const testResponse: GameCollection = {games: []}
    const mockHandler = jest.fn(async (): Promise<ApiResponseType> => {
      return Promise.resolve(testResponse)
    }) as (apiRequest: ApiRequest) => Promise<ApiResponseType>;

    const routes: ApiRoute[] = [
      {
        method: 'GET',
        pattern: /^\/v1\/game$/,
        handler: mockHandler,
      },
    ];

    const apiRequestHandler = new ApiRequestHandler(routes);
    const testApiEvent: Partial<APIGatewayProxyEvent> = {
      httpMethod: 'GET',
      path: '/v1/invalid',
      queryStringParameters: {username: 'tester1'},
      headers: {Authorization: testJwt},
    }
    const apiResponse = await apiRequestHandler.handleApiEvent(testApiEvent as APIGatewayProxyEvent)
    expect(apiResponse.statusCode).toEqual(StatusCodes.NOT_FOUND)
    expect(console.error).toBeCalled()
  })
  it('Should return Bad Request if invalid request', async () => {
    const mockHandler = jest.fn((): Promise<ApiResponseType> => {
      throw new BadRequestError()
    }) as (apiRequest: ApiRequest) => Promise<ApiResponseType>;

    const routes: ApiRoute[] = [
      {
        method: 'GET',
        pattern: /^\/v1\/game$/,
        handler: mockHandler,
      },
    ];

    const apiRequestHandler = new ApiRequestHandler(routes);
    const testApiEvent: Partial<APIGatewayProxyEvent> = {
      httpMethod: 'GET',
      path: '/v1/game',
      queryStringParameters: {username: 'tester1'},
      headers: {Authorization: testJwt},
    }
    const apiResponse = await apiRequestHandler.handleApiEvent(testApiEvent as APIGatewayProxyEvent)
    expect(apiResponse.statusCode).toEqual(StatusCodes.BAD_REQUEST)
    expect(console.error).toBeCalled()
  })
  it('Should return Server Error if unhandled error encountered', async () => {
    const mockHandler = jest.fn((): Promise<ApiResponseType> => {
      throw new Error()
    }) as (apiRequest: ApiRequest) => Promise<ApiResponseType>;

    const routes: ApiRoute[] = [
      {
        method: 'GET',
        pattern: /^\/v1\/game$/,
        handler: mockHandler,
      },
    ];

    const apiRequestHandler = new ApiRequestHandler(routes);
    const testApiEvent: Partial<APIGatewayProxyEvent> = {
      httpMethod: 'GET',
      path: '/v1/game',
      queryStringParameters: {username: 'tester1'},
      headers: {Authorization: testJwt},
    }
    const apiResponse = await apiRequestHandler.handleApiEvent(testApiEvent as APIGatewayProxyEvent)
    expect(apiResponse.statusCode).toEqual(StatusCodes.INTERNAL_SERVER_ERROR)
    expect(console.error).toBeCalled()
  })
})
