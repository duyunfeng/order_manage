import { Router } from 'express'
import multer from 'multer'
import * as uploadController from '../controllers/upload.js'

const router = Router()

const upload = multer({ dest: 'uploads/' })

router.post('/', upload.single('file'), uploadController.uploadFile)

export default router 