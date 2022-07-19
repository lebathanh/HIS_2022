const MedicalFsModel = require('./MedicalFacilities_Model')
const createError = require('http-errors')
const { MdicalFValidate, updateMdicalFValidate } = require('../../helpers/validation')

class MedicalFacilitiesController {
  async addMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = MdicalFValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await MedicalFsModel.findOne({
            name: req.body.name,
            address: req.body.address,
          })
          if (isExist) {
            throw createError.Conflict('Medical Facility was exist!')
          } else {
            const newMFs = await new MedicalFsModel(req.body)
            const element = await newMFs.save()
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

  async updateMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateMdicalFValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundMFs = await MedicalFsModel.findOne({
            _id: req.body._id,
          })
          if (!foundMFs) {
            throw createError.Conflict('Medical Facility is not exist!')
          } else {
            if (req.body.name && req.body.address) {
              const isExist = await MedicalFsModel.findOne({
                _id: { $ne: req.body._id },
                name: req.body.name,
                address: req.body.address,
              })
              if (isExist) {
                throw createError.Conflict('Medical Facility was exist!')
              } else {
                foundMFs.name = req.body.name
                foundMFs.address = req.body.address
              }
            } else {
              if (req.body.name) {
                const isExist = await MedicalFsModel.findOne({
                  _id: { $ne: req.body._id },
                  name: req.body.name,
                  address: foundMFs.address,
                })
                if (isExist) {
                  throw createError.Conflict('Medical Facility was exist!')
                } else {
                  foundMFs.name = req.body.name
                }
              }
              if (req.body.address) {
                const isExist = await MedicalFsModel.findOne({
                  _id: { $ne: req.body._id },
                  name: foundMFs.name,
                  address: req.body.address,
                })
                if (isExist) {
                  throw createError.Conflict('Medical Facility was exist!')
                } else {
                  foundMFs.address = req.body.address
                }
              }
            }
            const element = await foundMFs.save()
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

  async deleteMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundMFs = await MedicalFsModel.findOne({
            _id: req.query._id,
          })
          if (!foundMFs) {
            throw createError.BadRequest('Medical facility is not exist')
          } else {
            await MedicalFsModel.deleteOne({
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

  async getAllMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await MedicalFsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const MedicalFs = await MedicalFsModel.find()
          .populate()
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, MedicalFs },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundMFs = await MedicalFsModel.findOne({
            _id: req.query._id,
          })
          if (!foundMFs) {
            throw createError.BadRequest('Medical facility is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundMFs,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async searchMedicalFs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query.text) {
          throw createError.BadRequest('text is require in query')
        } else {
          const medicalFs = await MedicalFsModel.aggregate([
            {
              $addFields: {
                text: {
                  $concat: ['$name', ' ', '$address'],
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
            elements: medicalFs,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new MedicalFacilitiesController()
