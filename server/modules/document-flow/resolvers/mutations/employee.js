import { deleteEntitys, addEntity, editEntity } from './common.js'
import { getValidValue } from '../../../common.js'

function validateEmployeeInput (args) {
  const {
    firstName, secondName, secondNameDat, middleName,
    tabelNumber, phone1, phone2, phone3, email1, email2
  } = args.employee
  const iFirstName = getValidValue(firstName, 'name')
  const iSecondName = getValidValue(secondName, 'name')
  const iSecondNameDat = getValidValue(secondNameDat, 'name')
  const iMiddleName = getValidValue(middleName, 'name')
  const iPhone1 = getValidValue(phone1, 'name')
  const iPhone2 = getValidValue(phone2, 'name')
  const iPhone3 = getValidValue(phone3, 'name')
  const iEmail1 = getValidValue(email1, 'email')
  const iEmail2 = getValidValue(email2, 'email')
  const iTabelNumber = getValidValue(tabelNumber, 'name')
  if (!iFirstName.length || !iSecondName.length || !iMiddleName.length) {
    throw new Error('Фамилия, имя и отчество не должны быть пустыми')
  }
  const output = {
    firstName: iFirstName,
    secondName: iSecondName,
    secondNameDat: iSecondNameDat,
    middleName: iMiddleName,
    tabelNumber: iTabelNumber,
    phone1: iPhone1,
    phone2: iPhone2,
    phone3: iPhone3,
    email1: iEmail1,
    email2: iEmail2
  }
  return output
}

async function afterCreateEmployee (newItem, args) {
  const { Positions } = args.employee
  if (!Positions || Positions.length) {
    await newItem.setCurrentPositions(Positions)
  }
}

async function editEmployeeFun (candidate, args) {
  const {
    firstName, secondName, secondNameDat, middleName,
    tabelNumber, phone1, phone2, phone3, email1, email2
  } = validateEmployeeInput(args)
  const { Positions } = args.employee

  if (Positions) {
    await candidate.setCurrentPositions(Positions)
  }
  candidate.firstName = firstName
  candidate.secondName = secondName
  candidate.secondNameDat = secondNameDat
  candidate.middleName = middleName
  candidate.tabelNumber = tabelNumber
  candidate.phone1 = phone1
  candidate.phone2 = phone2
  candidate.phone3 = phone3
  candidate.email1 = email1
  candidate.email2 = email2
}

async function deleteCurrentPositions (args, serverContext) {
  const { documentFlow: { model }, Op } = serverContext
  const deleteOptions = { where: { EmployeeId: { [Op.in]: args.ids } } }
  await model.CurrentPosition.destroy(deleteOptions)
}

export default {
  async addEmployee (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Employee',
      successText: 'Новый работник успешно добавлен',
      subscriptionTypeName: 'employeeChanged',
      subscriptionKey: 'EMPLOYEE_CHANGED',
      getValidatedInputs: validateEmployeeInput,
      afterCreate: afterCreateEmployee,
      existErrorText: 'Такой работник уже существует',
      uniqueFields: ['firstName', 'secondName', 'middleName']
    }
    const result = await addEntity(options, args, serverContext)
    return result
  },

  async editEmployee (_, args, serverContext) {
    const options = {
      check: 'isManagerCheck',
      entity: 'Employee',
      entityName: 'Работник',
      successText: 'Данные работника успешно изменены',
      subscriptionTypeName: 'employeeChanged',
      subscriptionKey: 'EMPLOYEE_CHANGED',
      editFunction: editEmployeeFun
    }
    const result = await editEntity(options, args, serverContext)
    return result
  },

  async deleteEmployees (_, args, serverContext) {
    const options = {
      check: 'isClerkCheck',
      entity: 'Employee',
      successText: 'Работники успешно удалены',
      subscriptionTypeName: 'employeeChanged',
      subscriptionKey: 'EMPLOYEE_CHANGED',
      beforeDeleteFunction: deleteCurrentPositions
    }
    const result = await deleteEntitys(options, args, serverContext)
    return result
  }
}
