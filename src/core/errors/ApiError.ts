import { ErrorCodes, ErrorMessages, ErrorStatusCodes, ErrorCode } from './errorCodes';

export class ApiError extends Error {
    public readonly code: ErrorCode;
    public readonly statusCode: number;
    public readonly timestamp: string;
    public readonly details?: Record<string, unknown>;

    constructor(
        code: ErrorCode,
        message?: string,
        details?: Record<string, unknown>
    ) {
        const defaultMessage = ErrorMessages[code];
        const statusCode = ErrorStatusCodes[code];

        super(message || defaultMessage);

        this.name = 'ApiError';
        this.code = code;
        this.statusCode = statusCode;
        this.timestamp = new Date().toISOString();
        this.details = details;

        // Ensure proper prototype chain for instanceof checks
        Object.setPrototypeOf(this, ApiError.prototype);
    }

    // Static factory methods for common errors
    static notFound(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    static validationError(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    static conflict(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    static internalError(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    static unauthorized(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    static forbidden(code: ErrorCode, message?: string, details?: Record<string, unknown>): ApiError {
        return new ApiError(code, message, details);
    }

    // Convert to JSON response format
    toJSON() {
        return {
            error: {
                code: this.code,
                message: this.message,
                statusCode: this.statusCode,
                timestamp: this.timestamp,
                ...(this.details && { details: this.details }),
            },
        };
    }

    // Convert to NextResponse format
    toResponse() {
        return {
            error: this.message,
            code: this.code,
            statusCode: this.statusCode,
            timestamp: this.timestamp,
            ...(this.details && { details: this.details }),
        };
    }
}

// Helper function to create API errors with proper typing
export function createApiError(
    code: ErrorCode,
    message?: string,
    details?: Record<string, unknown>
): ApiError {
    return new ApiError(code, message, details);
}

// Helper function to handle MongoDB errors and convert to ApiError
export function handleMongoError(err: unknown, entityName: string): never {
    if (err && typeof err === 'object' && 'code' in err) {
        const mongoError = err as { code: number; message: string };

        switch (mongoError.code) {
            case 11000: // Duplicate key error
                throw ApiError.conflict(
                    ErrorCodes.DATABASE.DUPLICATE_KEY,
                    `${entityName} already exists`,
                    { originalError: mongoError.message }
                );

            case 121: // Document validation failed
                throw ApiError.validationError(
                    ErrorCodes.DATABASE.CONSTRAINT_VIOLATION,
                    `Validation failed for ${entityName}`,
                    { originalError: mongoError.message }
                );

            default:
                throw ApiError.internalError(
                    ErrorCodes.DATABASE.QUERY_FAILED,
                    `Database operation failed for ${entityName}`,
                    { originalError: mongoError.message, code: mongoError.code }
                );
        }
    }

    throw ApiError.internalError(
        ErrorCodes.DATABASE.QUERY_FAILED,
        `Database operation failed for ${entityName}`,
        { originalError: err }
    );
}

// Helper function to validate required fields
export function validateRequiredId(_id: string | undefined, entityName: string): void {
    if (!_id) {
        throw ApiError.validationError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${entityName} ID is required`
        );
    }
}

// Helper function to validate entity exists
export function validateEntityExists(entity: unknown, entityName: string): void {
    if (!entity) {
        throw ApiError.notFound(
            ErrorCodes.GENERIC.NOT_FOUND,
            `${entityName} not found`
        );
    }
}

// Helper function to validate required fields
export function validateRequiredField(
    value: unknown,
    fieldName: string,
    entityName: string
): void {
    if (value === undefined || value === null || value === '') {
        throw ApiError.validationError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${fieldName} is required for ${entityName}`
        );
    }
}

// Helper function to validate string length
export function validateStringLength(
    value: string,
    fieldName: string,
    minLength: number,
    maxLength: number,
    entityName: string
): void {
    if (value.length < minLength || value.length > maxLength) {
        throw ApiError.validationError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${fieldName} must be between ${minLength} and ${maxLength} characters for ${entityName}`
        );
    }
}

// Helper function to validate numeric range
export function validateNumericRange(
    value: number,
    fieldName: string,
    min: number,
    max: number,
    entityName: string
): void {
    if (value < min || value > max) {
        throw ApiError.validationError(
            ErrorCodes.GENERIC.VALIDATION_ERROR,
            `${fieldName} must be between ${min} and ${max} for ${entityName}`
        );
    }
} 