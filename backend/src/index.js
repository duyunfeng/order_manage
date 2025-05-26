import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file at the very start

import express from 'express'
import cors from 'cors'
import usersRouter from '../routes/users.js'
import goodsRouter from '../routes/goods.js'
import ordersRouter from '../routes/orders.js'
import customersRouter from '../routes/customers.js'
import factoriesRouter from '../routes/factories.js'
import uploadRouter from '../routes/upload.js'
import pkg from '@prisma/client'
const { PrismaClient } = pkg
// 你可以按需引入其他路由

const app = express()
const prisma = new PrismaClient()

app.use(cors())
app.use(express.json())

// 路由注册
app.use('/api/users', usersRouter)
app.use('/api/goods', goodsRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/customers', customersRouter)
app.use('/api/factories', factoriesRouter)
app.use('/api/upload', uploadRouter)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' })
})
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Global error handler (optional but good practice)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`)
})
