// src/lib/db.ts 

import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

let cached = (global as unknown as { mongoose: MongooseCache | undefined }).mongoose;

if (!cached) {
  cached = (global as unknown as { mongoose: MongooseCache }).mongoose = { conn: null, promise: null };
}

async function connectDB() {
  
  if (cached!.conn) { 
    console.log("MongoDB conectado (cache)");
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };

    const uri = process.env.MONGODB_URI;

    if (!uri) {
        throw new Error('A variável de ambiente MONGODB_URI não está definida.');
    }

    cached!.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default connectDB;