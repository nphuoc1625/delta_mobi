import mongoose from "mongoose";
import { getMongoDBConfig, buildConnectionString, validateMongoDBConfig } from "@/infrac/mongoose-utils";

// Validate configuration on startup
validateMongoDBConfig();

const config = getMongoDBConfig();
const connectionString = buildConnectionString(config.uri, config.name);

interface CachedConnection {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

let cached: CachedConnection = (global as { mongoose?: CachedConnection }).mongoose || { conn: null, promise: null };

if (!cached) {
    cached = (global as { mongoose?: CachedConnection }).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }
    if (!cached.promise) {
        console.log(`🔌 [MONGODB] Connecting to database: ${config.name}`);

        cached.promise = mongoose.connect(connectionString, {
            bufferCommands: false,
        }).then((mongoose) => {
            console.log(`✅ [MONGODB] Connected to database: ${config.name}`);
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect; 