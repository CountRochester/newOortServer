export const getUsers = async (id) => {
  const functionFind = id ? 'findOne' : 'findAll'
  const where = id ? { where: { id } } : {}
  const users = await Auth.User[functionFind]({
    attributes: [
      'id',
      'name',
      'employeeId',
      'avatar',
      'createdAt',
      'updatedAt'
    ],
    include: [
      {
        model: Auth.Group,
        attributes: [
          'id'
        ],
        through: {
          attributes: []
        }
      }
    ],
    ...where
  })
  return users
}

export const formEmployees = async (ids) => {
  const employees = await getEmployees(ids)
  const employeesIndexed = []
  employees.forEach((el) => {
    let subdivisionsId = []
    const departmentsId = []
    const currentPositionsId = []
    el.CurrentPositions.forEach((el) => {
      currentPositionsId.push(el.id)
      const currentSubdivId = el.Subdivisions.reduce((acc, item) => [...acc, item.id.toString()], [])
      subdivisionsId = [...subdivisionsId, ...currentSubdivId]
      departmentsId.push(el.Department.id)
    })
    employeesIndexed[el.id] = {
      id: el.id,
      firstName: el.firstName,
      middleName: el.middleName,
      secondName: el.secondName,
      currentPositionsId,
      subdivisionsId,
      departmentsId
    }
  })
  return employeesIndexed
}

export const getEmployees = async (ids) => {
  if (!ids) { return }
  console.time('getEmployees')
  const employee = await Docs.Employee.findAll({
    where: {
      id: { [Op.in]: ids }
    },
    attributes: [
      'id',
      'firstName',
      'middleName',
      'secondName'
    ],
    include: [
      {
        model: Docs.CurrentPosition,
        attributes: ['id'],
        include: [
          {
            model: Docs.Subdivision,
            attributes: ['id']
          },
          {
            model: Docs.Department,
            attributes: ['id']
          }
        ]
      }
    ]
  })
  console.timeEnd('getEmployees')
  if (!employee) { return }
  return employee
}

export const formUser = (item, employees) => {
  const groupsId = item.Groups.reduce((acc, item) => [...acc, item.id.toString()], [])
  const employee = employees[item.employeeId] || {}
  return {
    id: item.id,
    name: item.name,
    employeeId: item.employeeId,
    firstName: employee?.firstName || '',
    middleName: employee?.middleName || '',
    secondName: employee?.secondName || '',
    currentPositionsId: employee?.currentPositionsId || [],
    departmentsId: employee?.departmentsId || [],
    subdivisionsId: employee?.subdivisionsId || [],
    groupsId,
    avatar: item.avatar,
    createdAt: moment(item.createdAt),
    updatedAt: moment(item.updatedAt)
  }
}

export const addAvatar = async (avatar, userName) => {
  const filename = avatar.split('.')
  const message = { messageType: 'success' }
  let fileExtention
  if (filename.length > 1) {
    fileExtention = filename[filename.length - 1]
  } else {
    fileExtention = ''
  }
  let moveOK = true
  const newFileName = `avatar-${userName}.${fileExtention}`
  await fs.rename(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, avatar),
    path.join(keys.STATIC_DIR, keys.AVATAR_STORAGE, newFileName),
    (err) => {
      if (err) {
        message.text += `Ошибка при прикреплении файла ${avatar}: ${err}`
        message.messageType = 'error'
        moveOK = false
      }
    })
  if (moveOK) {
    message.text += `Прикрепление файла ${avatar} успешно \n\r`
    message.avatar = newFileName
  }
  return message
}

export const deleteAvatarUpoad = async (fileName) => {
  const message = {}
  await fs.unlink(path.join(keys.STATIC_DIR, keys.UPLOAD_STORAGE, fileName), (err) => {
    if (err) {
      message.text += `Файл ${fileName}, ошибка: ${err}\n\r`
      message.messageType = 'error'
    }
  })
  return message
}

export const deleteAvatar = async (avatar) => {
  const message = {}
  await fs.unlink(path.join(keys.STATIC_DIR, keys.AVATAR_STORAGE, avatar), async (err) => {
    if (err) {
      const uplMess = await deleteAvatarUpoad(avatar)
      if (uplMess.messageType === 'error') {
        message.text = uplMess.text
        message.messageType = uplMess.messageType
      }
    } else {
      message.text = `Файл ${avatar} успешно удалён`
    }
  })
  return message
}