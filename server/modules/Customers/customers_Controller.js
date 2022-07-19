const CusModel = require('./customers_Model')
const CusGsModel = require('../CustomerGroups/CustomerGroups_Model')
const createError = require('http-errors')
const cloudinary = require('../../config/cloudinary')
const { customersValidate, editCustomersValidate } = require('../../helpers/validation')

class CustomersController {
  async createCus(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = customersValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await CusModel.findOne({
            idCard: req.body.idCard,
          })
          if (isExist) {
            throw createError.Conflict('ID Card is exist')
          } else {
            const newCus = await new CusModel({
              name: req.body.name,
              birth: new Date(req.body.birth),
              gender: req.body.gender,
              citizenship: req.body.citizenship,
              ethnic: req.body.ethnic,
              idCard: req.body.idCard,
              dateOfIssue: req.body.dateOfIssue,
              place: req.body.place,
              email: req.body.email,
              phone: req.body.phone,
              birthCertificatePlace: req.body.birthCertificatePlace,
              guardian: req.body.guardian || null,
              address: req.body.address,
              province: req.body.province,
              district: req.body.district,
              ward: req.body.ward,
              job: req.body.job || null,
              salary: req.body.salary || null,
              cusGroups: [],
              avatar: req.body.avatar || null,
            })

            // temp
            const foundGroup = null

            // check ng giam ho
            if (req.body.guardian) {
              foundGuardian = await CusModel.findOne({
                _id: req.body.guardian,
              })
              if (!foundGuardian) {
                throw createError.BadRequest('Customer is not exist')
              } else {
                newCus.guardian = foundGuardian._id
              }
            }

            // check nhom khach hang
            if (req.body.cusGroups) {
              foundGroup = await CusGsModel.findOne({
                _id: req.body.cusGroups,
              })
              if (!foundGroup) {
                throw createError.BadRequest('Group is not exist')
              } else {
                await newCus.cusGroups.push(foundGroup._id)
                await foundGroup.members.push(newCus._id)
              }
            }

            // check avatar
            if (req.body.avatar) {
              const imgResult = await cloudinary.uploader.upload(req.body.avatar)
              newCus.avatar = {
                imgUrl: imgResult.secure_url,
                cloudinary_id: imgResult.public_id,
              }
            }
            const element = await newCus.save()
            if (foundGroup) {
              await foundGroup.save()
            }
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

  async updateCus(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.body._id) {
          throw createError.BadRequest('_id is require')
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.body._id,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exist')
          } else {
            const { error } = editCustomersValidate(req.body)
            if (error) {
              throw createError.BadRequest(error.details[0].message)
            } else {
              foundCus.name = req.body.name || foundCus.name
              foundCus.birth = new Date(req.body.birth) || new Date(foundCus.birth)
              foundCus.gender = req.body.gender || foundCus.gender
              foundCus.citizenship = req.body.citizenship || foundCus.citizenship
              foundCus.ethnic = req.body.ethnic || foundCus.ethnic
              foundCus.phone = req.body.phone || foundCus.phone
              foundCus.birthCertificatePlace = req.body.birthCertificatePlace || foundCus.birthCertificatePlace
              foundCus.address = req.body.address || foundCus.address
              foundCus.job = req.body.job || foundCus.job
              foundCus.salary = req.body.salary || foundCus.salary
              foundCus.province = req.body.fprovince || foundCus.province
              foundCus.district = req.body.fdistrict || foundCus.district
              foundCus.ward = req.body.ward || foundCus.ward
              foundCus.email = req.body.email || foundCus.email
              foundCus.dateOfIssue = req.body.dateOfIssue || foundCus.dateOfIssue
              foundCus.place = req.body.place || foundCus.place

              // check id card
              if (req.body.idCard && req.body.idCard !== foundCus.idCard) {
                const isExist = await CusModel.findOne({
                  idCard: req.body.idCard,
                })
                if (isExist) {
                  throw createError.Conflict('ID card is exist')
                } else {
                  foundCus.idCard = req.body.idCard
                }
              }

              // check nguoi giam ho
              if (req.body.guardian) {
                const foundGuardian = await CusModel.findOne({
                  _id: req.body.guardian,
                })
                if (!foundGuardian) {
                  throw createError.BadRequest('Customer is not exist')
                } else {
                  foundCus.guardian = foundGuardian._id
                }
              } else {
                foundCus.guardian = req.body.guardian || null
              }

              // check nhom khach hang
              const newGroup = null
              const oldGroup = null
              if (req.body.cusGroups && req.body.cusGroups !== foundCus.cusGroups) {
                newGroup = await CusGsModel.findOne({
                  _id: req.body.cusGroups,
                })
                oldGroup = await CusGsModel.findOne({
                  _id: foundCus.cusGroups,
                })
                if (oldGroup && oldGroup.members.includes(foundCus._id)) {
                  const cusIndex = oldGroup.members.indexOf(foundCus._id)
                  await oldGroup.members.splice(cusIndex, 1)
                }
                if (newGroup && !newGroup.members.includes(foundCus._id)) {
                  await newGroup.members.push(foundCus._id)
                  foundCus.cusGroups = newGroup._id
                }
              } else {
                foundCus.cusGroups = req.body.cusGroups || null
              }

              // check avatar
              if (!req.body.avatar || req.body.avatar === '') {
                foundCus.avatar = req.body.avatar || null
              } else {
                if (foundCus.avatar === null) {
                  const imgResult = await cloudinary.uploader.upload(req.body.avatar)
                  foundCus.avatar = {
                    imgUrl: imgResult.secure_url,
                    cloudinary_id: imgResult.public_id,
                  }
                } else {
                  if (req.body.avatar !== foundCus.avatar.imgUrl) {
                    await cloudinary.uploader.destroy(foundCus.avatar.cloudinary_id)
                    const imgResult = await cloudinary.uploader.upload(req.body.avatar)
                    foundCus.avatar = {
                      imgUrl: imgResult.secure_url,
                      cloudinary_id: imgResult.public_id,
                    }
                  }
                }
              }

              const element = await foundCus.save()
              if (oldGroup || newGroup) {
                if (oldGroup) {
                  await oldGroup.save()
                }
                if (newGroup) {
                  await newGroup.save()
                }
              }
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

  async deleteCus(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.query._id,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exist')
          } else {
            if (foundCus.avatar) {
              await cloudinary.uploader.destroy(foundCus.avatar.cloudinary_id)
            }
            if (foundCus.cusGroups) {
              const foundGroup = await CusGsModel.findOne({
                _id: foundCus.cusGroups,
              })
              if (foundGroup && foundGroup.members.includes(foundCus._id)) {
                const indexCus = foundGroup.members.indexOf(foundCus._id)
                await foundGroup.members.splice(indexCus, 1)
                await foundGroup.save()
              }
            }
            await CusModel.deleteOne({
              _id: foundCus._id,
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

  async getAllCus(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await CusModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const customers = await CusModel.find()
          .populate([
            {
              path: 'cusGroups',
              model: 'CustomerGroups',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, customers },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getCusById(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.query._id,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundCus,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getCusByIdCard(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query.id) {
          throw createError.BadRequest('id require in query')
        } else {
          const foundCus = await CusModel.findOne({
            idCard: req.query.id,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundCus,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async searchCus(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query.text) {
          throw createError.BadRequest('text is require in query')
        } else {
          const customers = await CusModel.aggregate([
            {
              $addFields: {
                text: {
                  $concat: ['$name', ' ', '$idCard'],
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
            elements: customers,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CustomersController()
