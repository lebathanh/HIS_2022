const MSModel = require('./MedicalServices_Model')
const ObjectModel = require('../Objects/Objects_Model')
const createError = require('http-errors')
const { MSValidate, updateMSValidate } = require('../../helpers/validation')

class MedicalServicesController {
  async addMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = MSValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await MSModel.findOne({
            name: req.body.name,
          })
          if (isExist) {
            throw createError.Conflict('Medical Services was exist!')
          } else {
            const newMS = await new MSModel(req.body)
            newMS.objects = []
            const foundObs = await ObjectModel.find({
              _id: { $in: req.body.objects },
            })
            foundObs.forEach(async (obj) => {
              newMS.objects.push(obj._id)
            })
            const failObj = await req.body.objects.filter((_id) => !newMS.objects.includes(_id))
            const element = await newMS.save()
            res.json({
              status: 'OK',
              elements: newMS,
              failObj,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateMSValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundMS = await MSModel.findOne({
            _id: req.body._id,
          })
          if (!foundMS) {
            throw createError.Conflict('Medical Service is not exist!')
          } else {
            if (req.body.name && req.body.name !== foundMS.name) {
              const isExist = await MSModel.findOne({
                _id: { $ne: req.body._id },
                name: req.body.name,
              })
              if (isExist) {
                throw createError.BadRequest('Name is exist')
              } else {
                foundMS.name = req.body.name
              }
            }

            if (req.body.objects) {
              foundMS.objects = []
              if (req.body.objects.length > 0) {
                const foundObs = await ObjectModel.find({
                  _id: { $in: req.body.objects },
                })
                foundObs.forEach(async (obj) => {
                  foundMS.objects.push(obj._id)
                })
              }
            }

            foundMS.calculationUnit = req.body.calculationUnit || foundMS.calculationUnit
            foundMS.prices = req.body.prices || foundMS.prices
            foundMS.descriptions = req.body.descriptions || foundMS.descriptions

            const element = await foundMS.save()
            res.json({
              status: 'OK',
              elements: element,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundMS = await MSModel.findOne({
            _id: req.query._id,
          })
          if (!foundMS) {
            throw createError.BadRequest('Medical service is not exist')
          } else {
            await MSModel.deleteOne({
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

  async getAllMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await MSModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const MedicalSs = await MSModel.find()
          .populate([
            {
              path: 'objects',
              model: 'Objects',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, MedicalSs },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundMS = await MSModel.findOne({
            _id: req.query._id,
          })
          if (!foundMS) {
            throw createError.BadRequest('Medical Service is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundMS,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async searchMS(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query.text) {
          throw createError.BadRequest('text is require in query')
        } else {
          const medicalMS = await MSModel.aggregate([
            {
              $addFields: {
                text: {
                  $concat: ['$name'],
                },
              },
            },
            {
              $match: {
                text: {
                  $regex: req.query.text,
                  $options: 'i',
                },
              },
            },
          ])
          res.json({
            status: 'OK',
            elements: medicalMS,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new MedicalServicesController()
