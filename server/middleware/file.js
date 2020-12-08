import multer from 'fastify-multer'
import { v1 as uuidv1 } from 'uuid'

const storage = multer.diskStorage({
  destination (request, file, cb) {
    cb(null, 'static/file-storage/upload')
  },
  filename (request, file, cb) {
    cb(null, uuidv1() + '-' + file.originalname)
  }
})

const allowedTypes = [
  'application/pdf',
  'application/zip',
  'image/jpeg',
  'image/png',
  'image/tiff',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/zip',
  'application/octet-stream',
  'application/x-zip-compressed',
  'multipart/x-zip',
  'application/x-rar-compressed'
]

const fileFilter = (request, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

export default multer({
  storage,
  fileFilter
})
