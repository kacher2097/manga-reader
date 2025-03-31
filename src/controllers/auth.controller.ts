import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, fullName } = req.body

    // Kiểm tra username và email đã tồn tại
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    })

    if (existingUser) {
      return res.status(400).json({
        message: 'Username hoặc email đã được sử dụng'
      })
    }

    // Tạo user mới
    const user = new User({
      username,
      email,
      password,
      fullName
    })

    await user.save()

    // Tạo token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'Đăng ký thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi xảy ra' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body

    // Tìm user
    const user = await User.findOne({ username })

    if (!user || !user.isActive) {
      return res.status(401).json({
        message: 'Thông tin đăng nhập không chính xác'
      })
    }

    // Kiểm tra mật khẩu
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({
        message: 'Thông tin đăng nhập không chính xác'
      })
    }

    // Cập nhật thời gian đăng nhập
    user.lastLogin = new Date()
    await user.save()

    // Tạo token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Đăng nhập thành công',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi xảy ra' })
  }
}

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user

    res.json({
      user: {
        id: user?._id,
        username: user?.username,
        email: user?.email,
        fullName: user?.fullName,
        role: user?.role
      }
    })
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi xảy ra' })
  }
} 