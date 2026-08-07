interface AuthError {
  code?: string;
  message?: string;
  status?: number;
}

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  USER_ALREADY_EXISTS:
    "An account with this email already exists. Please sign in instead.",
  INVALID_EMAIL_OR_PASSWORD: "Invalid email or password.",
  EMAIL_NOT_VERIFIED: "Please verify your email before signing in.",
  EMAIL_ALREADY_VERIFIED: "This email is already verified.",
  ACCOUNT_NOT_FOUND: "No account found with this email.",
  USER_EMAIL_NOT_FOUND: "No account found with this email.",
  RATE_LIMITED: "Too many attempts. Please try again later.",
  PASSWORD_TOO_SHORT: "Password is too short.",
};

export const getAuthErrorMessage = (error: AuthError): string => {
  const code = error.code?.toUpperCase();
  return (
    (code && AUTH_ERROR_MESSAGES[code]) ??
    error.message ??
    "Something went wrong. Please try again."
  );
};
