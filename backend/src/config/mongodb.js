import mongoose from 'mongoose'

import { env } from '../config/environment.js'

export async function CONNECT_DB() {
  await mongoose.connect(env.MONGODB_URI + env.DATABASE_NAME, {
    autoIndex: process.env.BUILD_MODE !== 'prod'
  })
}
