const Joi = require('joi')

// Admin
const adminValidate = (data) => {
  const adminSchema = Joi.object({
    id: Joi.string().lowercase().min(4).max(12).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required(),
    password: Joi.string().min(6).max(18).required(),
  })

  return adminSchema.validate(data)
}

const loginValidate = (data) => {
  const loginSchema = Joi.object({
    id: Joi.string().lowercase().min(4).max(12).required(),
    password: Joi.string().min(6).max(18).required(),
  })

  return loginSchema.validate(data)
}

const changePassValidate = (data) => {
  const changePassSchema = Joi.object({
    _id: Joi.string().required(),
    password: Joi.string().min(6).max(18).required(),
  })

  return changePassSchema.validate(data)
}

// Customer
const customersValidate = (data) => {
  const customerSchema = Joi.object({
    name: Joi.string().min(1).max(100).required(),
    birth: Joi.string().required(),
    gender: Joi.string().required(),
    citizenship: Joi.string().required(),
    ethnic: Joi.string().required(),
    idCard: Joi.string().required(),
    phone: Joi.string().required(),
    dateOfIssue: Joi.string().required(),
    place: Joi.string().required(),
    email: Joi.string().required(),
    birthCertificatePlace: Joi.string().required(),
    guardian: Joi.string().allow(null),
    address: Joi.string().required(),
    province: Joi.object().required(),
    district: Joi.object().required(),
    ward: Joi.object().required(),
    job: Joi.string().allow(null),
    salary: Joi.number().allow(null),
    cusGroups: Joi.array().allow(null),
    avatar: Joi.string(),
  })
  return customerSchema.validate(data)
}

const editCustomersValidate = (data) => {
  const customerSchema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().min(1).max(100),
    birth: Joi.string(),
    gender: Joi.string(),
    citizenship: Joi.string(),
    ethnic: Joi.string(),
    idCard: Joi.string(),
    phone: Joi.string(),
    dateOfIssue: Joi.string(),
    place: Joi.string(),
    email: Joi.string(),
    birthCertificatePlace: Joi.string(),
    guardian: Joi.string().allow(null),
    province: Joi.object(),
    district: Joi.object(),
    ward: Joi.object(),
    address: Joi.string(),
    job: Joi.string().allow(null),
    salary: Joi.number().allow(null),
    cusGroups: Joi.string().allow(null),
    avatar: Joi.string().allow(null),
  })
  return customerSchema.validate(data)
}

// Customer Groups
const cusGsValidate = (data) => {
  const cusGsSchema = Joi.object({
    name: Joi.string().required(),
    members: Joi.array(),
    joinType: Joi.string().required(),
  })
  return cusGsSchema.validate(data)
}

const updateCusGsValidate = (data) => {
  const cusGsSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string(),
    members: Joi.array(),
    joinType: Joi.string(),
  })
  return cusGsSchema.validate(data)
}

const editMembersCusGsValidate = (data) => {
  const cusGsSchema = Joi.object({
    _id: Joi.string().required(),
    members: Joi.array().min(1).required(),
  })
  return cusGsSchema.validate(data)
}

// Benefit Rates
const BrsValidate = (data) => {
  const BRsSchema = Joi.object({
    id: Joi.string().required(),
    rates: Joi.number().min(0.1).max(1).required(),
    objs: Joi.array(),
    descriptions: Joi.string().allow(null, ''),
  })
  return BRsSchema.validate(data)
}

const EditBrsValidate = (data) => {
  const BRsSchema = Joi.object({
    _id: Joi.string().required(),
    id: Joi.string(),
    objs: Joi.array(),
    rates: Joi.number().min(0.1).max(1),
    descriptions: Joi.string().allow(null, ''),
  })
  return BRsSchema.validate(data)
}

// places
const PlaceValidate = (data) => {
  const PlaceSchema = Joi.object({
    id: Joi.string().required(),
    descriptions: Joi.string().allow(null, ''),
  })
  return PlaceSchema.validate(data)
}

const EditPlaceValidate = (data) => {
  const PlaceSchema = Joi.object({
    _id: Joi.string().required(),
    id: Joi.string(),
    descriptions: Joi.string().allow(null, ''),
  })
  return PlaceSchema.validate(data)
}

// Medical Facilities
const MdicalFValidate = (data) => {
  const MedicalFSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
  })
  return MedicalFSchema.validate(data)
}

const updateMdicalFValidate = (data) => {
  const MedicalFSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string(),
    address: Joi.string(),
  })
  return MedicalFSchema.validate(data)
}
// health Insurances
const HIValidate = (data) => {
  const HISchema = Joi.object({
    customer: Joi.string().required(),
    benefitRate: Joi.string().required(),
    place: Joi.string().required(),
    obj: Joi.string().required(),
    effectFrom: Joi.date().allow(null),
    effectTo: Joi.date().allow(null),
    bills: Joi.array().min(1),
  })
  return HISchema.validate(data)
}

const updateHIValidate = (data) => {
  const HISchema = Joi.object({
    _id: Joi.string().required(),
    customer: Joi.string(),
    benefitRate: Joi.string(),
    place: Joi.string(),
    obj: Joi.string(),
    effectFrom: Joi.date(),
    effectTo: Joi.date(),
    bills: Joi.array().min(0),
  })
  return HISchema.validate(data)
}

// Bills
const BillValidate = (data) => {
  const BillSchema = Joi.object({
    customer: Joi.string().required(),
    quantity: Joi.number().required(),
    money: Joi.number().required(),
    paid: Joi.boolean(),
    dateOfIssue: Joi.date().allow(null),
    receiver: Joi.string().allow(null),
  })
  return BillSchema.validate(data)
}

const updateBillValidate = (data) => {
  const BillSchema = Joi.object({
    _id: Joi.string().required(),
    paid: Joi.boolean(),
    dateOfIssue: Joi.date().allow(null),
    receiver: Joi.string().allow(null),
  })
  return BillSchema.validate(data)
}

// MS
const MSValidate = (data) => {
  const MSSchema = Joi.object({
    name: Joi.string().required(),
    calculationUnit: Joi.string().required(),
    prices: Joi.number().min(0).required(),
    objects: Joi.array().min(0).required(),
    descriptions: Joi.string(),
  })
  return MSSchema.validate(data)
}

const updateMSValidate = (data) => {
  const MSSchema = Joi.object({
    _id: Joi.string().required(),
    name: Joi.string(),
    calculationUnit: Joi.string(),
    prices: Joi.number().min(0),
    objects: Joi.array().min(0),
    descriptions: Joi.string(),
  })
  return MSSchema.validate(data)
}

// Therapy
const TherapyValidate = (data) => {
  const TherapySchema = Joi.object({
    customer: Joi.string().required(),
    hID: Joi.string().required(),
    services: Joi.array().min(0),
    time: Joi.date().required(),
    medicalF: Joi.string().required(),
    therapyFee: Joi.number().required(),
    realFee: Joi.number().required(),
    status: Joi.boolean(),
  })
  return TherapySchema.validate(data)
}

const updateTherapyValidate = (data) => {
  const TherapySchema = Joi.object({
    _id: Joi.string().required(),
    customer: Joi.string(),
    hID: Joi.string(),
    services: Joi.array().min(0),
    time: Joi.date(),
    medicalF: Joi.string(),
    therapyFee: Joi.number(),
    realFee: Joi.number(),
    status: Joi.boolean(),
  })
  return TherapySchema.validate(data)
}

// Statis
const StatisValidate = (data) => {
  const StatisSchema = Joi.object({
    medicalF: Joi.string().required(),
    month: Joi.number().required(),
    year: Joi.number().required(),
    therapies: Joi.array().min(0),
    medicalS: Joi.array().min(0),
    medicalFCollect: Joi.number().required(),
    medicalFSpend: Joi.number().required(),
    pPRFunds: Joi.number().required(),
    dIPFunds: Joi.number().required(),
    usedFunds: Joi.number().required(),
    nextFunds: Joi.number().required(),
    status: Joi.boolean(),
  })
  return StatisSchema.validate(data)
}

const updateStatisValidate = (data) => {
  const StatisSchema = Joi.object({
    _id: Joi.string().required(),
    medicalF: Joi.string(),
    month: Joi.number(),
    year: Joi.number(),
    therapies: Joi.array().min(0),
    medicalS: Joi.array().min(0),
    medicalFCollect: Joi.number(),
    medicalFSpend: Joi.number(),
    pPRFunds: Joi.number(),
    dIPFunds: Joi.number(),
    usedFunds: Joi.number(),
    nextFunds: Joi.number(),
    status: Joi.boolean(),
  })
  return StatisSchema.validate(data)
}

// SettleValidate
const SettleValidate = (data) => {
  const StatisSchema = Joi.object({
    medicalF: Joi.string().required(),
    statisticals: Joi.array().min(0).required(),
    quarter: Joi.number().required(),
    year: Joi.number().required(),
    status: Joi.boolean(),
  })
  return StatisSchema.validate(data)
}

const updateSettleValidate = (data) => {
  const StatisSchema = Joi.object({
    _id: Joi.string().required(),
    medicalF: Joi.string(),
    statisticals: Joi.array().min(0),
    quarter: Joi.number().required(),
    year: Joi.number().required(),
    status: Joi.boolean(),
  })
  return StatisSchema.validate(data)
}

module.exports = {
  adminValidate,
  loginValidate,
  changePassValidate,
  customersValidate,
  editCustomersValidate,
  cusGsValidate,
  updateCusGsValidate,
  editMembersCusGsValidate,
  BrsValidate,
  EditBrsValidate,
  PlaceValidate,
  EditPlaceValidate,
  MdicalFValidate,
  updateMdicalFValidate,
  HIValidate,
  updateHIValidate,
  BillValidate,
  updateBillValidate,
  MSValidate,
  updateMSValidate,
  TherapyValidate,
  updateTherapyValidate,
  StatisValidate,
  updateStatisValidate,
  SettleValidate,
  updateSettleValidate,
}
