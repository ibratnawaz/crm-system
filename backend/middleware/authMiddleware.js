const { async } = require('crypto-random-string')
const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.authToken = token
      req.user = await User.findById(decoded._id)

      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
  }

  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
})

const verifyToken = (req, res, next) => {
  const { user, authToken } = req
  if (user) {
    if (user.token !== authToken) {
      res.status(401)
      throw new Error('Not authorized, token failed')
    }
    next()
  } else {
    res.status(404)
    throw new Error('User not found')
  }
}

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error('Not authorized as an admin')
  }
}

module.exports = { protect, verifyToken, admin }
