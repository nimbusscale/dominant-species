interface QueryParameters {
  username?: string
}

interface BaseApiEvent {
  path: string;
  httpMethod: string;
  queryStringParameters: QueryParameters | null
  username: string | null
}
