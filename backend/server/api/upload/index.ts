import { writeFile, mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { randomUUID } from 'crypto'

/**
 * 文件上传处理API
 * 支持单文件上传，返回文件URL
 */
export default defineEventHandler(async (event) => {
  try {
    // 获取上传目录配置，默认为public/uploads
    const uploadDir = process.env.UPLOAD_DIR || './public/uploads'
    const maxFileSize = parseInt(process.env.MAX_FILE_SIZE || '10485760') // 默认10MB
    
    // 解析multipart表单数据
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      return { code: 1, message: '没有上传文件' }
    }
    
    const file = formData[0]
    
    // 检查文件大小
    if (file.data.length > maxFileSize) {
      return { code: 1, message: `文件大小超过限制 ${maxFileSize / 1024 / 1024}MB` }
    }
    
    // 获取文件扩展名
    const originalFilename = file.filename || 'unknown'
    const fileExt = originalFilename.includes('.')
      ? originalFilename.substring(originalFilename.lastIndexOf('.'))
      : ''
    
    // 检查文件类型
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.png').split(',')
    if (!allowedTypes.includes(fileExt.toLowerCase())) {
      return { code: 1, message: `不支持的文件类型: ${fileExt}` }
    }
    
    // 生成唯一文件名
    const uniqueFilename = `${randomUUID()}${fileExt}`
    const relativePath = join(uploadDir.replace('./public', ''), uniqueFilename)
    const fullPath = join(process.cwd(), uploadDir, uniqueFilename)
    
    // 确保目录存在
    await mkdir(dirname(fullPath), { recursive: true })
    
    // 写入文件
    await writeFile(fullPath, file.data)
    
    return {
      code: 0,
      data: {
        url: relativePath,
        originalName: originalFilename,
        size: file.data.length
      }
    }
  } catch (error) {
    console.error('文件上传错误:', error)
    return { code: 1, message: '文件上传失败' }
  }
})