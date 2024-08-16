export const ERRORS = {
  FORBIDDEN_API: { code: 'A011', message: 'Access denied', httpCode: 403 },

  //USER
  USER_FETCH_FAILED: {
    code: 'U002',
    message: 'Error when retrieving a user',
    httpCode: 500,
  },
  USER_NOT_UPDATED: {
    code: 'U003',
    message: 'Failed to update user',
    httpCode: 500,
  },
  NO_USER: { code: 'U004', message: 'User not found', httpCode: 404 },
  USER_NOT_ACTIVATED: {
    code: 'U005',
    message: 'Account has not been activated',
    httpCode: 403,
  },
  USER_ALREADY_EXISTS: {
    code: 'U006',
    message: 'User with this email already exists',
    httpCode: 409,
  },
  USER_NOT_FOUND: {
    code: 'U007',
    message: 'User with this email not found',
    httpCode: 404,
  },
  USER_CREATE_FAILED: {
    code: 'U008',
    message: 'Failed to create user',
    httpCode: 500,
  },
  USER_UPDATE_FAILED: {
    code: 'U009',
    message: 'Failed to update user',
    httpCode: 400,
  },
  USER_LIST_FETCH_FAILED: {
    code: 'U010',
    message: 'Failed fetching user list',
    httpCode: 500,
  },

  //AUTH
  AUTH_FAILED: {
    code: 'A001',
    message: 'Authentication failed',
    httpCode: 401,
  },
  LOGOUT_FAILED: {
    code: 'A002',
    message: 'Failed to logout',
    httpCode: 500,
  },
  TOKEN_NOT_FOUND: {
    code: 'A003',
    message: 'Token not found',
    httpCode: 404,
  },
  FAILED_TO_UPDATE: {
    code: 'A010',
    message: 'User update failed',
    httpCode: 500,
  },
  RESTORE_TOKEN_ERROR: {
    code: 'A013',
    message: 'Invalid recovery token',
    httpCode: 500,
  },
  INVALID_RESTORE_TOKEN: {
    code: 'A013',
    message: 'Invalid recovery token',
    httpCode: 400,
  },
  ERROR_WHILE_RESET_PASSWORD: {
    code: 'A014',
    message: 'Password reset filed',
    httpCode: 500,
  },
  NO_TOKEN: {
    code: 'A004',
    message: 'Token has already been used or does not exist',
    httpCode: 404,
  },
  TOKEN_GENERATION_FAILED: {
    code: 'A005',
    message: 'Failed to generate token',
    httpCode: 500,
  },
  TOKEN_REFRESH_FAILED: {
    code: 'A006',
    message: 'Failed to refresh token',
    httpCode: 500,
  },
  TOKEN_WAS_CHANGED: {
    code: 'A015',
    message:
      'The token cannot be decrypted. Perhaps the integrity of the token has been violated or it has been changed',
    httpCode: 400,
  },
  TOKEN_DELETE_FAILED: {
    code: 'A007',
    message: 'Failed to delete token',
    httpCode: 500,
  },
  INCORRECT_CREDENTIALS: {
    code: 'A002',
    message: 'Invalid email or password',
    httpCode: 400,
  },
  ALREADY_REGISTERED: {
    code: 'A001',
    message: 'User already exists',
    httpCode: 409,
  },
};
