import fs from 'node:fs';
import path from 'node:path';
import mongoose from 'mongoose';
import { env } from './env.js';

let embeddedMongo = null;

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`✅  MongoDB connected: ${mongoose.connection.host}`);
  } catch (err) {
    if (env.NODE_ENV !== 'production') {
      console.log(`⚠️  Local MongoDB at ${env.MONGODB_URI} is not running (${err.message}).`);
      console.log(`🚀  Starting embedded development MongoDB server...`);
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const dbDir = path.resolve(process.cwd(), '.mongodb_data');
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        try {
          embeddedMongo = await MongoMemoryServer.create({
            instance: {
              port: 27017,
              dbPath: dbDir,
              storageEngine: 'wiredTiger',
            },
          });
        } catch (mmsErr) {
          console.warn('⚠️  Persistent dbPath failed, falling back to clean in-memory MongoDB:', mmsErr.message);
          embeddedMongo = await MongoMemoryServer.create();
        }
        const uri = embeddedMongo.getUri() + 'staffsync';
        await mongoose.connect(uri);
        console.log(`✅  Embedded MongoDB connected at: ${uri}`);

        // Check if database needs seeding
        const { User } = await import('../models/user.model.js');
        const userCount = await User.countDocuments();
        if (userCount === 0) {
          console.log(`🌱  Database is empty — auto-seeding demo accounts...`);
          const { runSeed } = await import('../seed/seed.js');
          await runSeed({ disconnect: false });
        }
      } catch (innerErr) {
        console.error('❌  Failed to start embedded MongoDB:', innerErr.message);
        throw err;
      }
    } else {
      throw err;
    }
  }
}

export async function closeDB() {
  await mongoose.disconnect();
  if (embeddedMongo) {
    await embeddedMongo.stop();
  }
}

export function getDBStatus() {
  const state = mongoose.connection.readyState;
  // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
  return state === 1 ? 'connected' : 'disconnected';
}

