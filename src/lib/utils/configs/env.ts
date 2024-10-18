import { z } from 'zod';

const localEnv = {
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
  SOCKET_URL: process.env.NEXT_PUBLIC_SOCKET_URL,
};

const schema = z.object({
  AUTH_URL: z.string(),
  BACKEND_URL: z.string(),
  SOCKET_URL: z.string(),
});

export const env = schema.parse(localEnv);
