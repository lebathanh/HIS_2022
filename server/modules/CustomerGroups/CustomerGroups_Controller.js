const CusGsModel = require('./CustomerGroups_Model')
const CusModel = require('../Customers/customers_Model')
const { cusGsValidate, updateCusGsValidate, editMembersCusGsValidate } = require('../../helpers/validation')
const createError = require('http-errors')

class CustomerGroupsController {
  async createCusGs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = cusGsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const sameName = await CusGsModel.findOne({
            name: req.body.name,
          })
          if (sameName) {
            throw createError.Conflict('name is exist')
          } else {
            const newCusGs = await new CusGsModel({
              name: req.body.name,
              members: [],
              joinType: req.body.joinType,
            })

            if (!req.body.members.length <= 0) {
              const foundMembers = await CusModel.find({
                _id: {
                  $in: req.body.members,
                },
              })
              foundMembers.forEach(async (member) => {
                await newCusGs.members.push(member._id)
                await CusModel.findByIdAndUpdate({ _id: member._id }, { cusGroups: [newCusGs._id, ...(member.cusGroups ? member.cusGroups : [])] })
              })
            }

            const membersFail = req.body.members.filter((member) => !newCusGs.members.includes(member))

            await newCusGs.save()

            res.json({
              status: 'OK',
              elements: { newCusGs, membersFail },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async updateCusGs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = updateCusGsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundGroup = await CusGsModel.findOne({
            _id: req.body._id,
          })
          if (!foundGroup) {
            throw createError.BadRequest('Group is not exist')
          } else {
            if (req.body.name && req.body.name !== foundGroup.name) {
              const sameName = await CusGsModel.findOne({
                name: req.body.name,
              })
              if (sameName) {
                throw createError.Conflict('name is exist')
              } else {
                foundGroup.name = req.body.name
              }
            }

            if (req.body.joinType && req.body.joinType !== foundGroup.joinType) {
              foundGroup.joinType = req.body.joinType
            }
            const spliceMembers = await foundGroup.members.map((item) => item.toString()).filter((m) => !req.body.members.includes(m))

            spliceMembers.forEach(async (element) => {
              const foundMember = await CusModel.findOne({
                _id: element,
              })
              if (foundMember) {
                const index = foundMember.cusGroups.indexOf(foundGroup._id)
                if (index !== -1) {
                  await foundMember.cusGroups.splice(index, 1)
                  await foundMember.save()
                }
              }
            })

            req.body.members.forEach(async (element) => {
              const foundMember = await CusModel.findOne({
                _id: element,
              })
              if (foundMember) {
                const index = foundMember.cusGroups.indexOf(foundGroup._id)
                if (index === -1) {
                  await foundMember.cusGroups.push(foundGroup._id)
                  await foundMember.save()
                }
              }
            })
            foundGroup.members = req.body.members
            const element = await foundGroup.save()

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

  async addMember(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = editMembersCusGsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundGroup = await CusGsModel.findOne({
            _id: req.body._id,
          })
          if (!foundGroup) {
            throw createError.BadRequest('Group is not exist')
          } else {
            const availableMembers = await req.body.members.filter((member) => !foundGroup.members.includes(member))
            const existMembers = await req.body.members.filter((member) => !availableMembers.includes(member))
            const foundMembers = await CusModel.find({
              _id: { $in: availableMembers },
            })

            foundMembers.forEach(async (member) => {
              await foundGroup.members.push(member._id)
              if (member.cusGroups) {
                const oldGroup = await CusGsModel.findOne({
                  _id: member.cusGroups,
                })
                if (oldGroup && oldGroup.members.includes(member._id)) {
                  const indexMem = oldGroup.members.indexOf(member._id)
                  await oldGroup.members.splice(indexMem, 1)
                  await oldGroup.save()
                }
              }
              member.cusGroups = foundGroup._id
              await member.save()
            })

            const failMembers = await availableMembers.filter((member) => !foundGroup.members.includes(member))
            const element = await foundGroup.save()

            res.json({
              status: 'OK',
              elements: { element, existMembers, availableMembers, failMembers },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async deleteCusGrs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundCusGr = await CusGsModel.findOne({
            _id: req.query._id,
          })
          if (!foundCusGr) {
            throw createError.BadRequest('Group is not exist')
          } else {
            foundCusGr.members.forEach(async (member) => {
              const foundMember = await CusModel.findOne({
                _id: member,
              })
              if (foundMember) {
                const index = await foundMember.cusGroups.indexOf(foundCusGr._id)
                if (index >= 0) {
                  await foundMember.cusGroups.splice(index, 1)
                  await foundMember.save()
                }
              }
            })
            await CusGsModel.deleteOne({
              _id: foundCusGr._id,
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

  async deleteMember(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const { error } = editMembersCusGsValidate(req.body)
        if (error) {
          throw createError.BadRequest(error.details[0].message)
        } else {
          const foundGroup = await CusGsModel.findOne({
            _id: req.body._id,
          })
          if (!foundGroup) {
            throw createError.BadRequest('Group is not exist')
          } else {
            const existMembers = await req.body.members.filter((member) => foundGroup.members.includes(member))
            const nonExistMembers = await req.body.members.filter((member) => !foundGroup.members.includes(member))
            const foundMembers = await CusModel.find({
              _id: { $in: existMembers },
            })

            foundMembers.forEach(async (member) => {
              member.cusGroups = null
              const indexMem = await foundGroup.members.indexOf(member._id)
              await foundGroup.members.splice(indexMem, 1)
              await member.save()
            })

            const element = await foundGroup.save()
            const failMembers = await existMembers.filter((member) => foundGroup.members.includes(member))

            res.json({
              status: 'OK',
              elements: { element, existMembers, nonExistMembers, failMembers },
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async getAllCusGs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        const perPage = 999
        const page = (await req.params.page) || 1
        const pagesSize = await CusModel.find()
          .countDocuments()
          .then((num) => Math.ceil(num / perPage))

        const groups = await CusGsModel.find()
          .populate([
            {
              path: 'members',
              model: 'Customers',
            },
          ])
          .sort({})
          .skip(perPage * page - perPage)
          .limit(perPage)

        res.json({
          status: 'OK',
          elements: { page: parseInt(page), pagesSize, groups },
        })
      }
    } catch (error) {
      next(error)
    }
  }

  async getCusGsById(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query._id) {
          throw createError.BadRequest('_id require in query')
        } else {
          const foundGsCus = await CusGsModel.findOne({
            _id: req.query._id,
          })
          if (!foundGsCus) {
            throw createError.BadRequest('Group is not exit')
          } else {
            res.json({
              status: 'OK',
              elements: foundGsCus,
            })
          }
        }
      }
    } catch (error) {
      next(error)
    }
  }

  async searchCusGs(req, res, next) {
    try {
      if (!req.payload.isAdmin) {
        throw createError.Unauthorized()
      } else {
        if (!req.query.text) {
          throw createError.BadRequest('text is require in query')
        } else {
          const groups = await CusGsModel.aggregate([
            {
              $addFields: {
                text: {
                  $concat: ['$name', ' ', '$joinType'],
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
            elements: groups,
          })
        }
      }
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new CustomerGroupsController()
