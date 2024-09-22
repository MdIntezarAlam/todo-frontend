import { z } from 'zod';

const localEnv = {
  TODO_URL: process.env.NEXT_PUBLIC_TO_DO,
};

const schema = z.object({
  TODO_URL: z.string(),
});

export const env = schema.parse(localEnv);
