import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * Băm mật khẩu một chiều bằng bcrypt.
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
async function hash(plainPassword) {
  return bcrypt.hash(plainPassword, SALT_ROUNDS)
}

/**
 * So sánh mật khẩu thô với hash.
 * @param {string} plainPassword
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
async function compare(plainPassword, hash) {
  return bcrypt.compare(plainPassword, hash)
}

export const password = {
  hash,
  compare
}
