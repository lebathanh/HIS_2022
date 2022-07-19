const BRsModel = require('./BenefitRates_Model')
const ObjsModel = require('../Objects/Objects_Model')
const createError = require('http-errors')
const { BrsValidate, EditBrsValidate } = require('../../helpers/validation')

class BenefitRatesController {
  async addBRs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = BrsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await BRsModel.findOne({
            id: req.body.id,
          })
          if (isExist) {
            throw createError.Conflict('id is exist')
          } else {
            const newBRs = await new BRsModel({
              id: req.body.id,
              rates: req.body.rates,
              descriptions: req.body.descriptions,
            })
            const temp = {
              failObjs: [],
              successObjs: [],
            }
            if (req.body.objs && req.body.objs.length > 0) {
              const foundObjs = await ObjsModel.find({
                _id: { $in: req.body.objs },
              })
              foundObjs.forEach(async (obj) => {
                await newBRs.objs.push(obj._id)
                temp.successObjs.push(obj._id)
              })
            }
            const element = await newBRs.save()
            temp.failObjs = await req.body.objs.filter((obj) => !newBRs.objs.includes(obj))
            res.json({
              status: 'OK',
              elements: { element, ...temp },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateBRs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = EditBrsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundBRs = await BRsModel.findOne({
            _id: req.body._id,
          })
          if (!foundBRs) {
            throw createError.BadRequest('Brs is not exist')
          } else {
            if (req.body.id && req.body.id !== foundBRs.id) {
              const isSame = await BRsModel.findOne({
                id: req.body.id,
              })
              if (isSame) {
                throw createError.Conflict('id is exist')
              } else {
                foundBRs.id = req.body.id
              }
            }
            if (req.body.rates && req.body.rates !== foundBRs.rates) {
              foundBRs.rates = req.body.rates || foundBRs.rates
            }
            if (req.body.descriptions && req.body.descriptions !== foundBRs.descriptions) {
              foundBRs.descriptions = req.body.descriptions || foundBRs.descriptions
            }

            const temp = {
              failObjs: [],
              successObjs: [],
            }
            if (req.body.objs) {
              if (req.body.objs.length > 0) {
                foundBRs.objs = []
                const foundObjs = await ObjsModel.find({
                  _id: { $in: req.body.objs },
                })
                foundObjs.forEach(async (obj) => {
                  await foundBRs.objs.push(obj._id)
                  temp.successObjs.push(obj._id)
                })
              } else {
                foundBRs.objs = []
              }
            }

            const element = await foundBRs.save()
            temp.failObjs = await req.body.objs.filter((obj) => !foundBRs.objs.includes(obj))

            res.json({
              status: 'OK',
              elements: { element, ...temp },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteBRs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundBRs = await BRsModel.findOne({
            _id: req.query._id,
          })
          if (!foundBRs) {
            throw createError.BadRequest('BRs is not exist')
          } else {
            await BRsModel.deleteOne({
              _id: req.query._id,
            })
            res.json({
              status: 'OK',
              elements: {},
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAllBRs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await BRsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const bRs = await BRsModel.find()
          .populate([
            {
              path: 'objs',
              model: 'Objects',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, bRs },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdBRs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundBRs = await BRsModel.findOne({
            _id: req.query._id,
          })
          if (!foundBRs) {
            throw createError.BadRequest('Customer is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundBRs,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BenefitRatesController()
