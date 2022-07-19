const BillsModel = require('./Bills_Model')
const HIModel = require('../HealthInsurances/healthInsurances_Model')
const CusModel = require('../Customers/customers_Model')
const createError = require('http-errors')
const { BillValidate, updateBillValidate } = require('../../helpers/validation')
const { addDays } = require('../../helpers/addDays')

class BillsController {
  async addBill(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = BillValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundCus = await CusModel.findOne({
            _id: req.body.customer,
          })
          if (!foundCus) {
            throw createError.BadRequest('Customer is not exist')
          } else {
            const foundHI = await HIModel.findOne({
              customer: req.body.customer,
            })
            if (!foundHI) {
              throw createError.BadRequest('Customer do not have a HI')
            } else {
              const isNotPaid = await BillsModel.findOne({
                customer: foundCus._id,
                paid: false,
              })
              if (isNotPaid) {
                throw createError.Conflict('Chua thanh toan')
              } else {
                const newBill = await new BillsModel({
                  customer: foundCus._id,
                  quantity: req.body.quantity || 1,
                  money: req.body.money,
                  paid: req.body.paid || false,
                  dateOfIssue: req.body.dateOfIssue || null,
                  receiver: req.body.receiver || null,
                })

                if (req.body.paid) {
                  if (!foundHI.effectFrom) {
                    foundHI.effectFrom = new Date()
                  }
                  if (!foundHI.effectTo) {
                    foundHI.effectTo = addDays(new Date(), newBill.quantity * 365)
                  } else {
                    foundHI.effectTo =
                      new Date(foundHI.effectTo).getTime() > new Date()
                        ? addDays(new Date(foundHI.effectTo), newBill.quantity * 365)
                        : addDays(new Date(), newBill.quantity * 365)
                  }
                }

                await newBill.save()
                await foundHI.bills.push(newBill._id)
                await foundHI.save()
                res.json({
                  status: 'OK',
                  elements: {
                    HI: foundHI,
                    Bill: newBill,
                  },
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

  async updateBill(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateBillValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundBill = await BillsModel.findOne({
            _id: req.body._id,
          })
          const foundHI = await HIModel.findOne({
            customer: foundBill.customer,
          }).populate([
            {
              path: 'bills',
              model: 'Bills',
            },
          ])
          if (!foundBill) {
            throw createError.BadRequest('Bill is not exist')
          } else {
            foundBill.dateOfIssue = req.body.dateOfIssue ? new Date(req.body.dateOfIssue) : null
            foundBill.receiver = req.body.receiver || foundBill.receiver
            if (req.body.paid !== null && req.body.paid !== foundBill.paid) {
              if (req.body.paid) {
                if (!foundHI.effectFrom) {
                  foundHI.effectFrom = new Date()
                }
                if (!foundHI.effectTo) {
                  foundHI.effectTo = addDays(new Date(), foundBill.quantity * 365)
                } else {
                  foundHI.effectTo =
                    new Date(foundHI.effectTo).getTime() > new Date()
                      ? addDays(new Date(foundHI.effectTo), foundBill.quantity * 365)
                      : addDays(new Date(), foundBill.quantity * 365)
                }
              } else {
                if (foundHI.bills.filter((b) => b.paid === true).length > 1) {
                  if (!foundHI.effectFrom) {
                    foundHI.effectFrom = new Date()
                  }
                  if (!foundHI.effectTo) {
                    foundHI.effectTo = addDays(new Date(), -(foundBill.quantity * 365))
                  } else {
                    foundHI.effectTo =
                      new Date(foundHI.effectTo).getTime() > new Date()
                        ? addDays(new Date(foundHI.effectTo), -(foundBill.quantity * 365))
                        : addDays(new Date(), -(foundBill.quantity * 365))
                  }
                } else {
                  foundHI.effectFrom = null
                  foundHI.effectTo = null
                }
                foundBill.dateOfIssue = null
                foundBill.receiver = null
              }
              foundBill.paid = req.body.paid
            }

            await foundBill.save()
            await foundHI.save()
            res.json({
              status: 'OK',
              elements: {
                HI: foundHI,
                Bill: foundBill,
              },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteBill(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundBill = await BillsModel.findOne({
            _id: req.query._id,
          })
          if (!foundBill) {
            throw createError.BadRequest('Bill is not exist')
          } else {
            const foundHI = await HIModel.findOne({
              customer: foundBill.customer,
            })
            if (foundBill.paid) {
              throw createError.Forbidden('Customer had paid! You can not delete this bill')
            } else {
              if (foundHI.bills.includes(foundBill._id)) {
                const index = foundHI.bills.indexOf(foundBill._id)
                await foundHI.bills.splice(index, 1)
              }
            }
            await foundHI.save()
            await BillsModel.deleteOne({ _id: foundBill._id })
            res.json({
              status: 'OK',
              elements: { HI: foundHI },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAllBill(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 1
        const page = (await req.params.page) || 1
        const pagesSize = await BillsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Bills = await BillsModel.find()
          .populate()
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Bills },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdBill(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundBill = await BillsModel.findOne({
            _id: req.query._id,
          })
          if (!foundBill) {
            throw createError.BadRequest('Bill is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundBill,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getByCus(req, res, next) {
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
            const foundHI = await HIModel.findOne({
              customer: foundCus._id,
            })
            if (!foundHI) {
              throw createError.BadRequest('Customer do not have a HI')
            } else {
              const bills = await BillsModel.find({
                _id: { $in: foundHI.bills },
              })
              res.json({
                status: 'OK',
                elements: bills,
              })
            }
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new BillsController()
