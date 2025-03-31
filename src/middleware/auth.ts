import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'

interface JwtPayload {
  userId: string
  role: string
}

declare global {
  namespace Express {
    interface Request {
      user?: IUser
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')
    
    if (!token) {
      throw new Error()
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload
    const user = await User.findById(decoded.userId)

    if (!user || !user.isActive) {
      throw new Error()
    }

    req.user = user
    next()
  } catch (error) {
    res.status(401).json({ message: 'Vui lòng đăng nhập' })
  }
}

export const requireRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Vui lòng đăng nhập' })
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập' })
    }

    next()
  }
}

// Middleware kiểm tra quyền admin
export const requireAdmin = requireRole(['admin'])

// Middleware kiểm tra người dùng đã xác thực
export const requireAuth = auth 