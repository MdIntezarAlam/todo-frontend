// import { isAxiosError } from 'axios';
// import { ZodError } from 'zod';

// export function getErrorMessage(error: unknown) {
//   let message: string = '';

//   if (isAxiosError(error)) {
//     message = error?.response?.data?.message;
//   } else if (error instanceof ZodError) {
//     message = error.issues[0].message;
//   } else if (error instanceof Error) {
//     message = error.message;
//   } else if (typeof error === 'string') {
//     message = error;
//   } else if (error && typeof error === 'object' && 'message' in error) {
//     message = String(error.message);
//   }
//   return message;
// }
import { isAxiosError } from 'axios';
import { ZodError } from 'zod';

export function getErrorMessage(error: unknown) {
  // Initialize the message as an empty string
  let message = '';

  if (isAxiosError(error)) {
    // If backend sends error message, use it
    message = error?.response?.data?.message || '';
  } else if (error instanceof ZodError) {
    // If Zod validation fails, use the first issue's message
    message = error.issues[0]?.message || '';
  } else if (error instanceof Error) {
    // For any other errors, use the error's message
    message = error.message;
  } else if (typeof error === 'string') {
    message = error;
  } else if (error && typeof error === 'object' && 'message' in error) {
    message = String(error.message);
  }

  // Return message from backend, or leave it empty if not present
  return message;
}
