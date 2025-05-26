import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { v4 as uuidv4 } from 'uuid'
import * as uploadController from '../controllers/upload.js'

const router = Router()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuidv4()
    const extension = path.extname(file.originalname)
    cb(null, uniqueSuffix + extension)
  },
})

const upload = multer({ storage: storage })

router.post('/', upload.single('file'), uploadController.uploadFile)

export default router 