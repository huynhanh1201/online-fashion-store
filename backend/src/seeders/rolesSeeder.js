import mongoose from 'mongoose'

import { RoleModel } from '~/models/RoleModel'

import { CONNECT_DB } from '~/config/mongodb'

try {
  // Connection to Database
  await CONNECT_DB()
} catch (err) {
  throw err
}
