const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const AdminsModel = require('../modules/Administrators/administrators_Model')
const client = require('../config/connection_redis')

const signAccessToken = async (adminId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: adminId,
    }
    const options = {
      expiresIn: '1d',
    }

    jwt.sign(payload, process.env.SECRET, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

const verifyAccessToken = async (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers.authorization || req.body.authorization || req.query.authorization
  if (token) {
    try {
      token = await token.split(' ')[1]
      jwt.verify(token, process.env.SECRET, async (err, token) => {
        if (err) {
          return next(err.name === 'TokenExpiredError' ? createError.Unauthorized('Token expired') : createError.Unauthorized('Invalid token'))
        } else {
          const foundAdmin = await AdminsModel.findOne({
            _id: token._id,
          })
          if (foundAdmin) {
            req.payload = {
              _id: token._id,
              isAdmin: true,
            }
            next()
          } else {
            req.payload = {
              _id: token._id,
              isAdmin: false,
            }
            next()
          }
        }
      })
    } catch (error) {
      next(error)
    }
  } else {
    return next(createError.Unauthorized())
  }
}

const signRefreshToken = async (adminId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: adminId,
    }
    const options = {
      expiresIn: '30d',
    }

    jwt.sign(payload, process.env.SECRET, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        client.set(adminId.toString(), token, 'EX', 365 * 24 * 60 * 60, (err, reply) => {
          if (err) return reject(createError.InternalServerError('Set token on redis failed'))
        })
        resolve(token)
      }
    })
  })
}

const signResetToken = async (adminId) => {
  return new Promise((resolve, reject) => {
    const payload = {
      _id: adminId,
    }
    const options = {
      expiresIn: '1h',
    }

    jwt.sign(payload, process.env.SECRET, options, (err, token) => {
      if (err) {
        reject(err)
      } else {
        resolve(token)
      }
    })
  })
}

const verifyRefreshToken = async (token) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.SECRET, (err, payload) => {
        if (err) {
          err.name === 'TokenExpiredError' ? createError.Unauthorized('Token expired') : createError.Unauthorized('Invalid token')
          return reject(err)
        } else {
          client.get(payload._id, (err, reply) => {
            if (err) return reject(createError.InternalServerError('Set token on redis failed'))
            if (token === reply) {
              resolve(payload)
            } else {
              return reject(createError.Unauthorized())
            }
          })
        }
      })
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  signResetToken,
  verifyRefreshToken,
}
