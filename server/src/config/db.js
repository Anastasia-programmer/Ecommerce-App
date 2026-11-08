import mongoose from 'mongoose'

/**
 * Connects Mongoose to MongoDB.
 * If MONGODB_URI is empty, a temporary in-memory MongoDB is started instead
 * (a real mongod binary, downloaded on first run), so the API works with no setup.
 * Its data is lost when the server stops.
 */
export async function connectDB() {
  let uri = process.env.MONGODB_URI

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server')
    const mongod = await MongoMemoryServer.create()
    uri = mongod.getUri('maktaba')
    console.log('No MONGODB_URI set: using an in-memory MongoDB (data resets on restart)')
    console.log(`Open it in MongoDB Compass with: ${uri}`)
  }

  await mongoose.connect(uri)
  console.log(`MongoDB connected (database: ${mongoose.connection.name})`)
}
