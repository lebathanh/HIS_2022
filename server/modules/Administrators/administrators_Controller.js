const AdminsModel = require('./administrators_Model')
const nodemailer = require('nodemailer')
const createError = require('http-errors')
const client = require('../../config/connection_redis')
const { adminValidate, loginValidate, changePassValidate } = require('../../helpers/validation')
const { signAccessToken, signRefreshToken, signResetToken, verifyRefreshToken } = require('../../helpers/jwtService')

class AdministratorsController {
  async createAdmin(req, res, next) {
    // const { id, email, password } = req.body
    // const admin = await new AdminsModel({
    //   id,
    //   email,
    //   password,
    // })
    // await admin.save()
    // res.json({
    //   status: 'OK',
    //   elements: admin,
    // })
    try {
      const isSuperAdmin = await AdminsModel.findOne({
        _id: req.payload._id,
        isSuper: true,
      })
      if (!isSuperAdmin) {
        throw createError.Unauthorized()
      } else {
        const { id, email, password } = req.body
        const { error } = adminValidate({ id, email, password })
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await AdminsModel.findOne({
            id,
          })
          if (isExist) {
            throw createError.Conflict(`${id} has been existed`)
          } else {
            const admin = await new AdminsModel({
              id,
              email,
              password,
            })
            await admin.save()
            res.json({
              status: 'OK',
              elements: admin,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAllAdmin(req, res, next) {
    try {
      const isSuperAdmin = await AdminsModel.findOne({
        _id: req.payload._id,
        isSuper: true,
      })
      if (!isSuperAdmin) {
        throw createError.Unauthorized()
      } else {
        const admins = await AdminsModel.find({
          _id: { $ne: isSuperAdmin._id },
        })
        res.json({
          status: 'OK',
          elements: admins,
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteAdmin(req, res, next) {
    try {
      const isSuperAdmin = await AdminsModel.findOne({
        _id: req.payload._id,
        isSuper: true,
      })
      if (!isSuperAdmin) {
        throw createError.Unauthorized()
      } else {
        const foundAdmin = await AdminsModel.findOne({
          _id: req.query._id,
          isSuper: false,
        })
        if (!foundAdmin) {
          throw createError.NotFound(`${req.body._id} does not exists`)
        } else {
          await foundAdmin.deleteOne({ _id: foundAdmin._id })
          res.json({
            status: 'OK',
            elements: {},
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async loginAdmin(req, res, next) {
    try {
      const { id, password } = req.body
      const { error } = loginValidate(req.body)
      if (error) {
        throw createError.BadRequest(error.details[0].message)
      } else {
        const foundAdmin = await AdminsModel.findOne({
          id,
        })
        if (!foundAdmin) {
          throw createError.NotFound(`${id} does not exists`)
        } else {
          const isValid = await foundAdmin.isCheckPassword(password)
          if (!isValid) {
            throw createError.BadRequest(`Incorrect password`)
          } else {
            const accessToken = await signAccessToken(foundAdmin._id)
            const refreshToken = await signRefreshToken(foundAdmin._id)
            res.json({
              status: 'OK',
              elements: foundAdmin,
              token: accessToken,
              refreshToken,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAdmin(req, res, next) {
    try {
      const foundAdmin = await AdminsModel.findOne({
        _id: req.payload._id,
      })
      res.json({
        status: 'OK',
        user: foundAdmin,
      })
    } catch (error) {
      next(error)
    }
  }

  async changePasswordAdmin(req, res, next) {
    try {
      const _id = req.body._id
      const password = req.body.newPassword
      const { error } = changePassValidate({ _id, password })
      if (error) {
        throw createError.BadRequest(error.details[0].message)
      } else {
        const isSuper = await AdminsModel.findOne({
          _id: req.payload._id,
          isSuper: true,
        })
        if (!isSuper) {
          throw createError.Unauthorized()
        } else {
          if (req.body._id === req.payload._id) {
            const isValid = await isSuper.isCheckPassword(req.body.oldPassword)
            if (!isValid) {
              throw createError.Unauthorized('Old password is incorrected')
            } else {
              const isSame = await isSuper.isCheckPassword(req.body.newPassword)
              if (isSame) {
                throw createError.BadRequest('New password must be not same current password')
              } else {
                isSuper.password = req.body.newPassword
                const foundAdmin = await isSuper.save()
                res.json({
                  status: 'OK',
                  elements: foundAdmin,
                })
              }
            }
          } else {
            const isAdmin = await AdminsModel.findOne({
              _id: req.body._id,
            })
            if (!isAdmin) {
              throw createError.NotFound(`${req.body._id} does not exist`)
            } else {
              const isValid = await isAdmin.isCheckPassword(req.body.newPassword)
              if (isValid) {
                throw createError.BadRequest('New password must be not same current password')
              } else {
                isAdmin.password = req.body.newPassword
                const foundAdmin = await isAdmin.save()
                res.json({
                  status: 'OK',
                  elements: foundAdmin,
                })
              }
            }
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async changePassword(req, res, next) {
    try {
      const _id = req.body._id
      const password = req.body.password
      const { error } = changePassValidate({ _id, password })
      if (error) {
        throw createError.BadRequest(error.details[0].message)
      } else {
        const isSuper = await AdminsModel.findOne({
          _id: req.payload._id,
          isSuper: true,
        })
        if (!isSuper) {
          throw createError.Forbidden()
        } else {
          const foundAdmin = await AdminsModel.findOne({
            _id,
          })
          foundAdmin.password = password
          const element = await foundAdmin.save()
          res.json({
            status: 'OK',
            elements: element,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async forGotPassword(req, res, next) {
    try {
      const isSuper = await AdminsModel.findOne({
        id: req.body.id,
        isSuper: true,
      })

      if (!isSuper) {
        throw createError.Unauthorized()
      } else {
        if (req.body.email !== isSuper.email) {
          throw createError.BadRequest('Email is incorect')
        } else {
          const token = await signResetToken(isSuper._id)
          const mailSrv = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.MAIL_SVR,
              pass: process.env.MAIL_SVR_PASS,
            },
          })
          const mailOpt = {
            from: process.env.MAIL_SVR,
            to: req.body.email,
            subject: 'Reset your password',
            html: `<p>Welcome to BTech-Social Net, your reset password link: <a href="http://localhost:3000/auth/reset/${token}">Reset password</a></p>`,
          }

          mailSrv.sendMail(mailOpt, function (error, info) {
            if (error) {
              console.log(error)
              next(error)
            } else {
              res.json({
                status: 'OK',
                elements: {},
              })
            }
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async resetPassword(req, res, next) {
    try {
      const _id = req.payload._id
      const password = req.body.password
      const { error } = changePassValidate({ _id, password })
      if (error) {
        throw createError.BadRequest(error.details[0].message)
      } else {
        const isSuper = await AdminsModel.findOne({
          _id: req.payload._id,
          isSuper: true,
        })
        if (!isSuper) {
          throw createError.Unauthorized()
        } else {
          isSuper.password = req.body.password
          const element = await isSuper.save()
          res.json({
            status: 'OK',
            elements: element,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        throw createError.BadRequest('Refresh token is require')
      }
      const { _id } = await verifyRefreshToken(refreshToken)
      const accessToken = await signAccessToken(_id)
      const rfeshToken = await signRefreshToken(_id)
      res.json({
        status: 'OK',
        token: accessToken,
        refreshToken: rfeshToken,
      })
    } catch (error) {
      next(error)
    }
  }

  async logOutAdmin(req, res, next) {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) {
        throw createError.BadRequest()
      } else {
        const { _id } = await verifyRefreshToken(refreshToken)
        client.del(_id.toString(), (err, reply) => {
          if (err) throw createError.InternalServerError('Logout redis failed')
          else res.json({ status: 'OK' })
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AdministratorsController()
