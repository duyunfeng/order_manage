import pkg from '@prisma/client'
const { PrismaClient } = pkg
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // 检查是否已存在 admin 用户
  const admin = await prisma.user.findUnique({
    where: { username: 'admin' },
  })
  if (!admin) {
    await prisma.user.create({
      data: {
        id: 'USER_ADMIN',
        username: 'admin',
        password: await bcrypt.hash('123456', 10), // 默认密码，可自行修改
        name: '超级管理员',
        role: 'admin',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  } else {
    console.log('admin 用户已存在')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
