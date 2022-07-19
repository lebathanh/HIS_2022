const ObjectsModel = require('./Objects_Model')
const createError = require('http-errors')
const { PlaceValidate, EditPlaceValidate } = require('../../helpers/validation')

class ObjectsController {
  async addObjects(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = PlaceValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await ObjectsModel.findOne({
            id: req.body.id,
          })
          if (isExist) {
            throw createError.Conflict('id is exist')
          } else {
            const newObj = await new ObjectsModel(req.body)
            const element = await newObj.save()
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

  async updateObjects(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = EditPlaceValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundObj = await ObjectsModel.findOne({
            _id: req.body._id,
          })
          if (!foundObj) {
            throw createError.BadRequest('Object is not exist')
          } else {
            if (req.body.id && req.body.id !== foundObj.id) {
              const isSame = await ObjectsModel.findOne({
                id: req.body.id,
              })
              if (isSame) {
                throw createError.Conflict('id is exist')
              } else {
                foundObj.id = req.body.id
              }
            }
            if (req.body.descriptions && req.body.descriptions !== foundObj.descriptions) {
              foundObj.descriptions = req.body.descriptions || foundObj.descriptions
            }
            const element = await foundObj.save()
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

  async deleteObjects(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundObj = await ObjectsModel.findOne({
            _id: req.query._id,
          })
          if (!foundObj) {
            throw createError.BadRequest('Obj is not exist')
          } else {
            await ObjectsModel.deleteOne({
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

  async getAllObjects(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await ObjectsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Objects = await ObjectsModel.find()
          .populate()
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Objects },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdObjects(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundObj = await ObjectsModel.findOne({
            _id: req.query._id,
          })
          if (!foundObj) {
            throw createError.BadRequest('Obj is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundObj,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ObjectsController()
