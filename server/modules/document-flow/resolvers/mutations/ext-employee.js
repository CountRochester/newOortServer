import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'
import { formExtEmployeeData } from '../query/ext-employee.js'

function validateExtEmployeeInput (args) {
  const {
    firstName, secondName, secondNameDat, middleName,
    phone1, phone2, fax, email1, email2
  } = args.employee
  const iFirstName = getValidValue(firstName, 'name')
  const iSecondName = getValidValue(secondName, 'name')
  const iSecondNameDat = getValidValue(secondNameDat, 'name')
  const iMiddleName = getValidValue(middleName, 'name')
  const iPhone1 = getValidValue(phone1, 'name')
  const iPhone2 = getValidValue(phone2, 'name')
  const iFax = getValidValue(fax, 'name')
  const iEmail1 = getValidValue(email1, 'email')
  const iEmail2 = getValidValue(email2, 'email')
  if (!iFirstName.length || !iSecondName.length || !iMiddleName.length) {
    throw new Error('Фамилия, имя и отчество не должны быть пустыми')
  }
  const output = {
    firstName: iFirstName,
    secondName: iSecondName,
    secondNameDat: iSecondNameDat,
    middleName: iMiddleName,
    phone1: iPhone1,
    phone2: iPhone2,
    fax: iFax,
    email1: iEmail1,
    email2: iEmail2
  }
  return output
}

function editExtEmployeeFun (candidate, args) {
  const {
    firstName, secondName, secondNameDat, middleName,
    phone1, phone2, fax, email1, email2
  } = validateExtEmployeeInput(args)

  candidate.firstName = firstName
  candidate.secondName = secondName
  candidate.secondNameDat = secondNameDat
  candidate.middleName = middleName
  candidate.phone1 = phone1
  candidate.phone2 = phone2
  candidate.fax = fax
  candidate.email1 = email1
  candidate.email2 = email2
}

async function deleteCurrentPositions (args, serverContext) {
  const { documentFlow: { model }, Op } = serverContext
  const deleteOptions = { where: { EmployeeId: { [Op.in]: args.ids } } }

  await model.CurrentPosition.destroy(deleteOptions)
}

export default {
  async addExtEmployee (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtEmployee',
      successText: 'Новый работник успешно добавлен',
      subscriptionTypeName: 'extEmployeeChanged',
      subscriptionKey: 'EXT_EMPLOYEE_CHANGED',
      getValidatedInputs: validateExtEmployeeInput,
      formOutput: formExtEmployeeData,
      existErrorText: 'Такой работник уже существует',
      uniqueFields: ['firstName', 'secondName', 'middleName']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editExtEmployee (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'ExtEmployee',
      entityName: 'Работник',
      successText: 'Данные работника успешно изменены',
      subscriptionTypeName: 'extEmployeeChanged',
      subscriptionKey: 'EXT_EMPLOYEE_CHANGED',
      editFunction: editExtEmployeeFun,
      formOutput: formExtEmployeeData
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteExtEmployees (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'ExtEmployee',
      successText: 'Работники успешно удалены',
      subscriptionTypeName: 'employeeChanged',
      subscriptionKey: 'EMPLOYEE_CHANGED',
      beforeDeleteFunction: deleteCurrentPositions
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
