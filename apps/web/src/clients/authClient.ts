import { createAuthClient } from '@personal-finance-app/auth/client';
import { env } from '@/env';

export const authClient = createAuthClient({
  apiBaseUrl: env.PUBLIC_SERVER_URL,
});

export type AuthSession =
  | ReturnType<typeof createAuthClient>['$Infer']['Session']
  | null;

type ErrorTypes = Record<keyof typeof authClient.$ERROR_CODES, string>;

const errorMessages = {
  USER_NOT_FOUND:
    "We couldn't find an account with that email. Please check your email or sign up for a new account.",
  FAILED_TO_CREATE_USER:
    'An error occurred while creating your account. Please try again later.',
  FAILED_TO_CREATE_SESSION:
    'An error occurred while creating your session. Please try again later.',
  FAILED_TO_UPDATE_USER:
    'An error occurred while updating your account. Please try again later.',
  FAILED_TO_GET_SESSION:
    'An error occurred while retrieving your session. Please try again later.',
  INVALID_PASSWORD: 'The password you entered is incorrect. Please try again.',
  INVALID_EMAIL:
    'The email address you entered is not valid. Please check and try again.',
  INVALID_EMAIL_OR_PASSWORD:
    'The email or password you entered is incorrect. Please try again.',
  SOCIAL_ACCOUNT_ALREADY_LINKED:
    'This social account is already linked to another user.',
  PROVIDER_NOT_FOUND:
    'The authentication provider was not found. Please try again.',
  INVALID_TOKEN: 'The token provided is invalid. Please try again.',
  ID_TOKEN_NOT_SUPPORTED:
    'The ID token provided is not supported. Please try again.',
  FAILED_TO_GET_USER_INFO:
    'An error occurred while retrieving user information. Please try again later.',
  USER_EMAIL_NOT_FOUND:
    "We couldn't find an account with that email. Please check your email or sign up for a new account.",
  EMAIL_NOT_VERIFIED:
    'Your email address has not been verified. Please check your email for verification instructions.',
  PASSWORD_TOO_SHORT:
    'The password you entered is too short. Please choose a password with at least 8 characters.',
  PASSWORD_TOO_LONG:
    'The password you entered is too long. Please choose a shorter password.',
  USER_ALREADY_EXISTS:
    'An account with this email already exists. Please use a different email or try logging in.',
  EMAIL_CAN_NOT_BE_UPDATED:
    'Your email address cannot be updated. Please contact support for assistance.',
  CREDENTIAL_ACCOUNT_NOT_FOUND:
    'The credential account was not found. Please try again.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  FAILED_TO_UNLINK_LAST_ACCOUNT:
    'Failed to unlink the last account. Please try again.',
  ACCOUNT_NOT_FOUND: 'The account was not found. Please try again.',
} satisfies ErrorTypes;

export function getFriendlyAuthErrorMessage(code: string): string {
  return (
    errorMessages[code as keyof typeof errorMessages] ||
    'An unknown error occurred. Please try again later.'
  );
}

