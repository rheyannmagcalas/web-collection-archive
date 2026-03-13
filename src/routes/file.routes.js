import express from 'express'
import { upload } from '../middleware/upload.middleware.js'
import { getFilesPage, uploadFile, downloadFile, deleteFile } from '../controllers/file.controllers.js'

const router = express.Router()

router.get('/', getFilesPage)
router.post('/upload', upload.single('file'), uploadFile)
router.get('/download/:filename', downloadFile)
router.post('/delete/:id', deleteFile)

export default router