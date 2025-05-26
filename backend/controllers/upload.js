export async function uploadFile(req, res) {
  console.log(req.file, req)
  if (!req.file) {
    return res.json({ code: 1, message: '未检测到上传文件' })
  }
  // 假设上传目录为 /uploads
  const fileUrl = `/uploads/${req.file.filename}`
  res.json({ code: 0, data: { url: fileUrl, filename: req.file.filename } })
} 