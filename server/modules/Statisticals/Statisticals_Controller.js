const StatisticalsModel = require('./Statisticals_Model')
const TherapyModel = require('../Therapies/Therapies_Model')
const ExcelJS = require('exceljs')
const fs = require('fs')
var path = require('path')
const createError = require('http-errors')
const { StatisValidate, updateStatisValidate } = require('../../helpers/validation')

class StatisticalsController {
  async addStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = StatisValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const isExist = await StatisticalsModel.findOne({
            medicalF: req.body.medicalF,
            month: req.body.month,
            year: req.body.year,
          })
          if (isExist) {
            throw createError.Conflict('Statis is exist')
          } else {
            const foundTherapies = await TherapyModel.find({
              _id: { $in: req.body.therapies },
            })
            if (foundTherapies.length !== req.body.therapies.length) {
              throw createError.BadRequest('Therapies array is not exist all')
            } else {
              await TherapyModel.updateMany({ _id: { $in: req.body.therapies } }, { $set: { status: true } })
              const newStatis = await new StatisticalsModel(req.body)
              const element = await newStatis.save()
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

  async updateStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateStatisValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundStatis = await StatisticalsModel.findOne({
            _id: req.body._id,
          })
          if (!foundStatis) {
            throw createError.BadRequest('This statis does not exist')
          } else {
            const isExist = await StatisticalsModel.findOne({
              _id: { $ne: foundStatis._id },
              medicalF: req.body.medicalF,
              month: req.body.month,
              year: req.body.year,
            })
            if (isExist) {
              throw createError.Conflict('This statis is exist')
            } else {
              if (req.body.therapies) {
                if (req.body.therapies.length > 0) {
                  if (foundStatis.therapies.length > 0) {
                    await TherapyModel.updateMany({ _id: { $in: foundStatis.therapies } }, { $set: { status: false } })
                    await TherapyModel.updateMany({ _id: { $in: req.body.therapies } }, { $set: { status: true } })
                  } else {
                    await TherapyModel.updateMany({ _id: { $in: req.body.therapies } }, { $set: { status: true } })
                  }
                } else {
                  if (foundStatis.therapies.length > 0) {
                    await TherapyModel.updateMany({ _id: { $in: foundStatis.therapies } }, { $set: { status: false } })
                  }
                }
                foundStatis.therapies = req.body.therapies || foundStatis.therapies
              }

              foundStatis.medicalF = req.body.medicalF || foundStatis.medicalF
              foundStatis.year = req.body.year || foundStatis.year
              foundStatis.month = req.body.month || foundStatis.month
              foundStatis.medicalS = req.body.medicalS || foundStatis.medicalS
              foundStatis.medicalFCollect = req.body.medicalFCollect || foundStatis.medicalFCollect
              foundStatis.medicalFSpend = req.body.medicalFSpend || foundStatis.medicalFSpend
              foundStatis.pPRFunds = req.body.pPRFunds || foundStatis.pPRFunds
              foundStatis.dIPFunds = req.body.dIPFunds || foundStatis.dIPFunds
              foundStatis.usedFunds = req.body.usedFunds || foundStatis.usedFunds
              foundStatis.nextFunds = req.body.nextFunds || foundStatis.nextFunds
              const element = await foundStatis.save()
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

  async deleteStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id is require in query')
        } else {
          const foundStatis = await StatisticalsModel.findOne({
            _id: req.query._id,
          })
          if (!foundStatis) {
            throw createError.BadRequest('Statis does not exist')
          } else {
            await TherapyModel.updateMany({ _id: { $in: foundStatis.therapies } }, { $set: { status: false } })
            await StatisticalsModel.deleteOne({
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

  async getAllStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await StatisticalsModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const Statises = await StatisticalsModel.find()
          .populate([
            {
              path: 'medicalF',
              model: 'MedicalFacilities',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, Statises },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getByIdStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundStatis = await StatisticalsModel.findOne({
            _id: req.query._id,
          })
          if (!foundStatis) {
            throw createError.BadRequest('Statis does not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundStatis,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async filtersStatis(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const medicalF = req.query.mF
        const month = parseInt(req.query.month)
        const year = parseInt(req.query.year)
        let foundStatis = []
        if (req.query.mF && req.query.month && req.query.year) {
          foundStatis = await StatisticalsModel.find({
            medicalF,
            month,
            year,
          })
        }
        if (req.query.mF && req.query.month && !req.query.year) {
          foundStatis = await StatisticalsModel.find({
            medicalF,
            month,
          })
        }
        if (req.query.mF && !req.query.month && req.query.year) {
          foundStatis = await StatisticalsModel.find({
            medicalF,
            year,
          })
        }
        if (!req.query.mF && req.query.month && req.query.year) {
          foundStatis = await StatisticalsModel.find({
            month,
            year,
          })
        }
        if (req.query.mF && !req.query.month && !req.query.year) {
          foundStatis = await StatisticalsModel.find({
            medicalF,
          })
        }
        if (!req.query.mF && req.query.month && !req.query.year) {
          foundStatis = await StatisticalsModel.find({
            month,
          })
        }
        if (!req.query.mF && !req.query.month && req.query.year) {
          foundStatis = await StatisticalsModel.find({
            year,
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

  async createFile(req, res, next) {
    try {
      const statis = await StatisticalsModel.findOne({
        _id: req.query._id,
      })
      const therapies = await TherapyModel.find({
        _id: { $in: statis.therapies },
      }).populate([
        {
          path: 'customer',
          model: 'Customers',
        },
        {
          path: 'hID',
          model: 'HealthInsurances',
        },
        {
          path: 'medicalF',
          model: 'MedicalFacilities',
        },
      ])

      const dataList = therapies.map((t) => ({
        customer: t.customer.name,
        idCard: t.customer.idCard,
        time: t.time,
        fee: t.therapyFee,
        sale: t.therapyFee - t.realFee,
        realFee: t.realFee,
      }))

      console.log(dataList)
      const workbook = new ExcelJS.Workbook()
      const sheet = workbook.addWorksheet('Bao Cao')
      sheet.columns = [
        { header: 'Khách hàng', key: 'customer' },
        { header: 'CMND', key: 'idCard' },
        { header: 'Thời gian', key: 'time' },
        { header: 'Chi Phí', key: 'fee' },
        { header: 'Miễn Giảm', key: 'sale' },
        { header: 'Thực thu', key: 'realFee' },
      ]
      dataList.forEach((element) => {
        sheet.addRow(element)
      })
      const p = __dirname.split('\\')
      p.splice(p.length - 2, 2)
      const file = `${p.join('\\')}\\public\\files\\${`export`}.xlsx`
      await workbook.xlsx.writeFile(file)
      res.download(file)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new StatisticalsController()
