/**
 * Database utility functions for managing different environments
 */

export interface MongoDBConfig {
    uri: string;
    name: string;
    environment: string;
}

/**
 * Get database configuration based on environment
 */
export function getMongoDBConfig(): MongoDBConfig {
    const environment = process.env.NODE_ENV || 'development';
    const baseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
    const dbName = process.env.MONGODB_DB_NAME || `delta_mobi_${environment}`;

    return {
        uri: baseUri,
        name: dbName,
        environment
    };
}

/**
 * Build connection string for specific database
 */
export function buildConnectionString(uri: string, dbName: string): string {
    // Handle MongoDB Atlas connection strings with query parameters
    const url = new URL(uri);

    // Set the database name in the pathname
    url.pathname = `/${dbName}`;

    return url.toString();
}

/**
 * Get database name for current environment
 */
export function getCurrentDatabaseName(): string {
    const config = getMongoDBConfig();
    return config.name;
}

/**
 * Validate database configuration
 */
export function validateMongoDBConfig(): void {
    const config = getMongoDBConfig();

    if (!config.uri) {
        throw new Error('MONGODB_URI environment variable is required');
    }

    if (!config.name) {
        throw new Error('MONGODB_DB_NAME environment variable is required');
    }

    console.log(`📊 [MONGODB] Environment: ${config.environment}`);
    console.log(`📊 [MONGODB] Database: ${config.name}`);
}

/**
 * Database naming conventions
 */
export const DATABASE_NAMES = {
    DEVELOPMENT: 'delta_mobi_dev',
    STAGING: 'delta_mobi_staging',
    PRODUCTION: 'delta_mobi_prod',
    TEST: 'delta_mobi_test'
} as const;

/**
 * Get database name by environment
 */
export function getDatabaseNameByEnvironment(env: string): string {
    switch (env.toLowerCase()) {
        case 'development':
        case 'dev':
            return DATABASE_NAMES.DEVELOPMENT;
        case 'staging':
            return DATABASE_NAMES.STAGING;
        case 'production':
        case 'prod':
            return DATABASE_NAMES.PRODUCTION;
        case 'test':
            return DATABASE_NAMES.TEST;
        default:
            return `delta_mobi_${env}`;
    }
} 