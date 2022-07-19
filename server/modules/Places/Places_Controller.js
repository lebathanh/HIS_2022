const PlacesModel = require('./Places_Model')
const createError = require('http-errors')
const { PlaceValidate, EditPlaceValidate } = require('../../helpers/validation')

class PlacesController {
  async addPlaces(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = PlaceValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await PlacesModel.findOne({
            id: req.body.id,
          })
          if (isExist) {
            throw createError.Conflict('id is exist')
          } else {
            const newPlace = await new PlacesModel(req.body)
            const element = await newPlace.save()
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

  async updatePlaces(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = EditPlaceValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundPlaces = await PlacesModel.findOne({
            _id: req.body._id,
          })
          if (!foundPlaces) {
            throw createError.BadRequest('Places is not exist')
          } else {
            if (req.body.id && req.body.id !== foundPlaces.id) {
              const isSame = await PlacesModel.findOne({
                id: req.body.id,
              })
              if (isSame) {
                throw createError.Conflict('id is exist')
              } else {
                foundPlaces.id = req.body.id
              }
            }
            if (req.body.descriptions && req.body.descriptions !== foundPlaces.descriptions) {
              foundPlaces.descriptions = req.body.descriptions || foundPlaces.descriptions
            }
            const element = await foundPlaces.save()
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

  async deletePlaces(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundPlaces = await PlacesModel.findOne({
            _id: req.query._id,
          })
          if (!foundPlaces) {
            throw createError.BadRequest('Place is not exist')
          } else {
            await PlacesModel.deleteOne({
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

  async getAllPlaces(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await PlacesModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Places = await PlacesModel.find()
          .populate()
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Places },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdPlaces(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundPlaces = await PlacesModel.findOne({
            _id: req.query._id,
          })
          if (!foundPlaces) {
            throw createError.BadRequest('Customer is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundPlaces,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new PlacesController()
