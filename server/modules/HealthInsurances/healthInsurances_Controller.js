const HIModel = require('./healthInsurances_Model')
const CusModel = require('../Customers/customers_Model')
const BRsModel = require('../BenefitRates/BenefitRates_Model')
const PlacesModel = require('../Places/Places_Model')
const BillsModel = require('../Bills/Bills_Model')
const ObjModel = require('../Objects/Objects_Model')
const cloudinary = require('../../config/cloudinary')
const fs = require('fs')
var path = require('path')
const createError = require('http-errors')
const { HIValidate, updateHIValidate } = require('../../helpers/validation')

class HIController {
  async addHI(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = HIValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.body.customer,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exist')
          } else {
            const isExist = await HIModel.findOne({
              customer: foundCus._id,
            })
            if (isExist) {
              throw createError.Conflict('Customer had a HI')
            } else {
              const foundBRs = await BRsModel.findOne({
                _id: req.body.benefitRate,
              })
              if (!foundBRs) {
                throw createError.BadRequest('BRs is not exist')
              } else {
                const foundPlace = await PlacesModel.findOne({
                  _id: req.body.place,
                })
                if (!foundPlace) {
                  throw createError.BadRequest('BRs is not exist')
                } else {
                  const foundObj = await ObjModel.findOne({
                    _id: req.body.obj,
                  })
                  if (!foundObj) {
                    throw createError.BadRequest('Obj is not exist')
                  } else {
                    const newHI = await new HIModel({
                      customer: foundCus._id,
                      benefitRate: foundBRs._id,
                      place: foundPlace._id,
                      obj: foundObj._id,
                      effectFrom: null,
                      effectTo: null,
                      bills: [],
                    })

                    const element = await newHI.save()

                    res.json({
                      status: 'OK',
                      elements: element,
                    })
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateHI(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateHIValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundHI = await HIModel.findOne({
            _id: req.body._id,
          })
          if (!foundHI) {
            throw createError.BadRequest('HI is not exist')
          } else {
            if (req.body.customer && req.body.customer !== foundHI.customer) {
              const foundCus = await CusModel.findOne({
                _id: req.body.customer,
              })
              if (!foundCus) {
                throw createError.BadRequest('Customer is not exist')
              } else {
                const isExist = await HIModel.findOne({
                  _id: {
                    $ne: foundHI._id,
                  },
                  customer: foundCus._id,
                })
                if (isExist) {
                  throw createError.Conflict('Customer had a BI')
                } else {
                  foundHI.customer = foundCus._id
                }
              }
            }

            if (req.body.benefitRate && req.body.benefitRate !== foundHI.benefitRate) {
              const foundBRs = await BRsModel.findOne({
                _id: req.body.benefitRate,
              })
              if (!foundBRs) {
                throw createError.BadRequest('BRs is not exist')
              } else {
                foundHI.benefitRate = foundBRs._id
              }
            }

            if (req.body.place && req.body.place !== foundHI.place) {
              const foundPlace = await PlacesModel.findOne({
                _id: req.body.place,
              })
              if (!foundPlace) {
                throw createError.BadRequest('Place is not exist')
              } else {
                foundHI.place = foundPlace._id
              }
            }

            if (req.body.obj && req.body.obj !== foundHI.obj) {
              const foundObj = await ObjModel.findOne({
                _id: req.body.obj,
              })
              if (!foundObj) {
                throw createError.BadRequest('obj is not exist')
              } else {
                foundHI.obj = foundObj._id
              }
            }

            if (req.body.effectFrom) {
              foundHI.effectFrom = new Date(req.body.effectFrom)
            }

            if (req.body.effectTo) {
              foundHI.effectTo = new Date(req.body.effectTo)
            }

            const element = await foundHI.save()

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

  async deleteHI(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundHI = await HIModel.findOne({
            _id: req.query._id,
          })
          if (!foundHI) {
            throw createError.BadRequest('HI is not exist')
          } else {
            if (foundHI.bills.length > 0) {
              await BillsModel.deleteMany({
                _id: {
                  $in: foundHI.bills,
                },
              })
            }
            await HIModel.deleteOne({
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

  async getAllHI(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await HIModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const HIs = await HIModel.find()
          .populate([
            {
              path: 'customer',
              model: 'Customers',
              populate: [
                {
                  path: 'cusGroups',
                  model: 'CustomerGroups',
                },
              ],
            },
            {
              path: 'benefitRate',
              model: 'BenefitRates',
            },
            {
              path: 'place',
              model: 'Places',
            },
            {
              path: 'obj',
              model: 'Objects',
            },
            {
              path: 'bills',
              model: 'Bills',
              populate: [
                {
                  path: 'customer',
                  model: 'Customers',
                },
              ],
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, HIs },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdHI(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundHI = await HIModel.findOne({
            _id: req.query._id,
          })
          if (!foundHI) {
            throw createError.BadRequest('HI is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundHI,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async dowHI(req, res, next) {
    try {
      const imgResult = await cloudinary.uploader.upload(req.body.data)
      res.json({
        url: imgResult.secure_url,
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new HIController()
