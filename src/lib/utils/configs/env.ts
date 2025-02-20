// import { z } from 'zod';

// const localEnv = {
//   AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
//   BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
//   SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
// };

// const schema = z.object({
//   AUTH_URL: z.string(),
//   BACKEND_URL: z.string(),
//   SOCKET_URL: z.string(),
// });

// export const env = schema.parse(localEnv);

import { z } from 'zod';

export const env = {
  AUTH_URL:
    process.env.NEXT_PUBLIC_AUTH_URL ??
    'https://dev-intezar-todo-in.onrender.com/api/v2/auth',
  BACKEND_URL:
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    'https://dev-intezar-todo-in.onrender.com/api/v2',
  SOCKET_URL:
    process.env.NEXT_PUBLIC_SOCKET_URL ??
    'https://dev-intezar-todo-in.onrender.com/',
} as const;

const schema = z.object({
  AUTH_URL: z.string().url(),
  BACKEND_URL: z.string().url(),
  SOCKET_URL: z.string().url(),
});

schema.parse(env);

export type TEnv = z.infer<typeof schema>;

// NOTE KEEP THIS ONE IN ROOT FILE .env
// # DEV locals link
// NEXT_PUBLIC_AUTH_URL = https://https://localhost:5000/api/v2/auth
// NEXT_PUBLIC_BACKEND_URL = https://https://localhost:5000/api/v2
// NEXT_PUBLIC_SOCKET_URL = https://https://localhost:5000/

// # PROD deployed link
// NEXT_PUBLIC_AUTH_URL = https://dev-intezar-todo-in.onrender.com/api/v2/auth
// NEXT_PUBLIC_BACKEND_URL = https://dev-intezar-todo-in.onrender.com/api/v2
// NEXT_PUBLIC_SOCKET_URL = https://dev-intezar-todo-in.onrender.com/
