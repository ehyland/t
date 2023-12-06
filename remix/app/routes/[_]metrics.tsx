import { LoaderFunctionArgs } from '@remix-run/node';
import { register } from '~/server/prometheus.server';

export async function loader({}: LoaderFunctionArgs) {
  return new Response(await register.metrics(), {
    status: 200,
    headers: {
      'Content-Type': register.contentType,
    },
  });
}
