import { z } from 'zod';

const localEnv = {
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  TODO_URL: process.env.NEXT_PUBLIC_TO_DO,
};

const schema = z.object({
  AUTH_URL: z.string(),
  TODO_URL: z.string(),
});

export const env = schema.parse(localEnv);
