import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const toPdf = (req, res) => {
  const { filename, force } = req.body // 新增force参数
  const uploadsDir = path.join(__dirname, '../uploads')
  const filePath = path.join(uploadsDir, filename)
  const ext = path.extname(filename).toLowerCase()
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: '文件不存在' })
  }
  // 只支持常见办公文档
  const supportExt = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt']
  if (!supportExt.includes(ext)) {
    return res.status(400).json({ error: '不支持的文件类型' })
  }
  // 转换后的 PDF 路径
  const pdfName = filename.replace(ext, '.pdf')
  const pdfPath = path.join(uploadsDir, pdfName)
  // force为true时强制重新转换
  if (fs.existsSync(pdfPath) && !force) {
    return res.json({ url: `/uploads/${pdfName}` })
  }
  // LibreOffice 转换
  exec(`libreoffice --headless --convert-to pdf --outdir "${uploadsDir}" "${filePath}"`, (err) => {
    if (err) return res.status(500).json({ error: '转换失败' })
    return res.json({ url: `/uploads/${pdfName}` })
  })
} 