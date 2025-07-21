// Error codes for consistent error handling across the application
export const ERROR_CODES = {
  SERVER_ERROR: "SERVER_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  BAD_REQUEST: "BAD_REQUEST",
  CONFLICT: "CONFLICT",
  DATABASE_ERROR: "DATABASE_ERROR",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
};

// Error messages for consistent user-facing messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.SERVER_ERROR]: "An unexpected error occurred",
  [ERROR_CODES.VALIDATION_ERROR]: "Validation failed",
  [ERROR_CODES.NOT_FOUND]: "Resource not found",
  [ERROR_CODES.UNAUTHORIZED]: "Unauthorized access",
  [ERROR_CODES.FORBIDDEN]: "Access forbidden",
  [ERROR_CODES.BAD_REQUEST]: "Bad request",
  [ERROR_CODES.CONFLICT]: "Resource conflict",
  [ERROR_CODES.DATABASE_ERROR]: "Database operation failed",
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: "External service error",
};

// HTTP status codes mapping
export const HTTP_STATUS_CODES = {
  [ERROR_CODES.SERVER_ERROR]: 500,
  [ERROR_CODES.VALIDATION_ERROR]: 400,
  [ERROR_CODES.NOT_FOUND]: 404,
  [ERROR_CODES.UNAUTHORIZED]: 401,
  [ERROR_CODES.FORBIDDEN]: 403,
  [ERROR_CODES.BAD_REQUEST]: 400,
  [ERROR_CODES.CONFLICT]: 409,
  [ERROR_CODES.DATABASE_ERROR]: 500,
  [ERROR_CODES.EXTERNAL_SERVICE_ERROR]: 502,
};

// Helper function to create error responses
export function createErrorResponse(code, message, details) {
  return {
    status: "error",
    message: message || ERROR_MESSAGES[code],
    code: ERROR_CODES[code],
    ...(details && { details }),
  };
}

// Helper function to get HTTP status code for error
export function getHttpStatusForError(code) {
  return HTTP_STATUS_CODES[code];
}

// Helper function to create success responses
export function createSuccessResponse(data) {
  return {
    status: "success",
    data,
  };
}

// Database error handler
export function handleDatabaseError(error, context) {
  console.error(`Database error in ${context}:`, error);

  // Check for specific database error types
  if (error.code === "ER_DUP_ENTRY") {
    return createErrorResponse("CONFLICT", "Resource already exists");
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return createErrorResponse(
      "BAD_REQUEST",
      "Referenced resource does not exist",
    );
  }

  // Default database error
  return createErrorResponse("DATABASE_ERROR");
}

// Validation error handler
export function handleValidationError(errors) {
  return createErrorResponse("VALIDATION_ERROR", "Validation failed", {
    errors,
  });
}
