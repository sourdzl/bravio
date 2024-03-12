import getEnv from '@/config/env';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PropsWithChildren } from 'react';

const client = new QueryClient();

const { serverUrl } = getEnv();


async function fetchData() {
  try {
    const response = await fetch(`${serverUrl}/protected`, {
      credentials: 'include',
      headers: {
        'Cookie': `access-token=${session.access_token}`,
      },
    });

    // Handle the response
    console.log(await response.json());
  } catch (error) {
    console.error('Error:', error);
  }
}

export default function QueryProvider({ children }: PropsWithChildren) {
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
