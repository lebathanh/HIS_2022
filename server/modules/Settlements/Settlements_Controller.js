const SettlementsModel = require('./Settlements_Model')
const StatisModel = require('../Statisticals/Statisticals_Model')
const createError = require('http-errors')
const { SettleValidate, updateSettleValidate } = require('../../helpers/validation')

class SettlementsController {
  async addSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = SettleValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await SettlementsModel.findOne({
            medicalF: req.body.medicalF,
            quarter: req.body.quarter,
            year: req.body.year,
          })
          if (isExist) {
            throw createError.Conflict('Settlement is exist')
          } else {
            const foundStatises = await StatisModel.find({
              _id: { $in: req.body.statisticals },
            })
            if (foundStatises.length !== req.body.statisticals.length) {
              throw createError.BadRequest('statisticals array is not exist all')
            } else {
              await StatisModel.updateMany({ _id: { $in: req.body.statisticals } }, { $set: { status: true } })
              const newSettlement = await new SettlementsModel(req.body)
              const element = await newSettlement.save()
              res.json({
                status: 'OK',
                elements: element,
              })
            }
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateSettleValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundSettle = await SettlementsModel.findOne({
            _id: req.body._id,
          })
          if (!foundSettle) {
            throw createError.BadRequest('This settlement does not exist')
          } else {
            const isExist = await SettlementsModel.findOne({
              _id: { $ne: foundSettle._id },
              medicalF: req.body.medicalF,
              quarter: req.body.quarter,
              year: req.body.year,
            })
            if (isExist) {
              throw createError.Conflict('is exist')
            } else {
              if (req.body.statisticals) {
                if (req.body.statisticals.length > 0) {
                  if (foundSettle.statisticals.length > 0) {
                    await StatisModel.updateMany({ _id: { $in: foundSettle.statisticals } }, { $set: { status: false } })
                    await StatisModel.updateMany({ _id: { $in: req.body.statisticals } }, { $set: { status: true } })
                  } else {
                    await StatisModel.updateMany({ _id: { $in: req.body.statisticals } }, { $set: { status: true } })
                  }
                } else {
                  if (foundSettle.statisticals.length > 0) {
                    await StatisModel.updateMany({ _id: { $in: foundSettle.statisticals } }, { $set: { status: false } })
                  }
                }
                foundSettle.statisticals = req.body.statisticals || foundSettle.statisticals
              }

              foundSettle.status = req.body.status || foundSettle.status
              foundSettle.medicalF = req.body.medicalF || foundSettle.medicalF
              foundSettle.quarter = req.body.quarter || foundSettle.quarter
              foundSettle.year = req.body.year || foundSettle.year
            }
          }

          const element = await foundSettle.save()
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

  async deleteSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundSettle = await SettlementsModel.findOne({
            _id: req.query._id,
          })
          if (!foundSettle) {
            throw createError.BadRequest('Settlement does not exist')
          } else {
            await StatisModel.updateMany({ _id: { $in: foundSettle.statisticals } }, { $set: { status: false } })
            await SettlementsModel.deleteOne({
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

  async getAllSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await SettlementsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Settles = await SettlementsModel.find()
          .populate([
            {
              path: 'medicalF',
              model: 'MedicalFacilities',
            },
            {
              path: 'statisticals',
              model: 'Statisticals',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Settles },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundSettle = await SettlementsModel.findOne({
            _id: req.query._id,
          })
          if (!foundSettle) {
            throw createError.BadRequest('Settlement does not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundSettle,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async filtersSettlement(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const quarter = parseInt(req.query.quarter)
        const year = parseInt(req.query.year)
        let foundStatis = []
        if (req.query.quarter && req.query.year) {
          foundStatis = await SettlementsModel.find({
            quarter,
            year,
          })
        }
        if (!req.query.quarter && req.query.year) {
          foundStatis = await SettlementsModel.find({
            year,
          })
        }
        if (req.query.quarter && !req.query.year) {
          foundStatis = await SettlementsModel.find({
            quarter,
          })
        }
        res.json({
          status: 'OK',
          elements: foundStatis,
        })
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new SettlementsController()
