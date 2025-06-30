export class ApiError extends Error {
    constructor(
        message: string,
        public statusCode: number = 500
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

export function handleMongoError(err: unknown, entityName: string): never {
    if (err && typeof err === 'object' && 'code' in err && err.code === 11000) {
        throw new ApiError(`${entityName} name must be unique.`, 409);
    }
    throw new ApiError(`Internal server error`, 500);
}

export function validateRequiredId(_id: string | undefined, entityName: string): void {
    if (!_id) {
        throw new ApiError(`${entityName} ID is required`, 400);
    }
}

export function validateEntityExists(entity: unknown, entityName: string): void {
    if (!entity) {
        throw new ApiError(`${entityName} not found`, 404);
    }
} 