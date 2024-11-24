import type { AppRouter } from '@repo/api';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    // httpLink({
    //   url: "http://localhost:4001/trpc",
    // }),
    httpBatchLink({
      url: '/trpc',
      // You can pass any HTTP headers you wish here
      // async headers() {
      //   return {
      //     authorization: getAuthCookie(),
      //   };
      // },
    }),
  ],
});
