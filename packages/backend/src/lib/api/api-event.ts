interface QueryParameters {
  username?: string;
}

export interface BaseApiEvent {
  path: string;
  httpMethod: string;
  queryStringParameters: QueryParameters | null;
  username: string | null;
}
