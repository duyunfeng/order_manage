import axios from '../plugins/axios'

/**
 * 上传文件API
 * @param file File对象
 * @returns Promise<string> 图片url
 */
export async function uploadFile(file: File): Promise<string> {
  const fd = new FormData()
  fd.append('file', file)
  const res = await axios.post('/upload', fd, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return res.data.url
} 