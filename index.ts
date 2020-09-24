import axios from "axios";
import { nanoid } from 'nanoid';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export type HttpEventRequest<T> = Omit<APIGatewayProxyEvent, 'queryStringParameters'> & {
    queryStringParameters: T
}

export type HttpResponse = Promise<APIGatewayProxyResult>;

export async function startFib(event: HttpEventRequest<{ n: string } | null>): HttpResponse {

    const { queryStringParameters } = event;

    if (queryStringParameters===null) {
      return { statusCode: 401, body: 'miss path' };
    }

    const { n } = queryStringParameters;

    if (!n) {
      return { statusCode: 401, body: '' };
    }

    const jobId = nanoid();

    const endpoint = 'http://54.93.81.82:3001/fib';

    try {

      const { data } = await axios.get<string>(endpoint, {
          params: { n, jobId }
      });

      console.log('---- data ', data);

      return {
        statusCode: 200,
        body: JSON.stringify({ jobId })
      };
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
      return {
        statusCode: 500,
        body: JSON.stringify({ jobId, error: true })
      };
    }
}
