const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')
const sendMail = require('../utils/sendMail')

// @desc    Login registered & activated user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })

  if (user && !user.isAccountActive) {
    res.status(401)
    throw new Error('Account is not activated')
  }

  if (user && (await user.matchPassword(password))) {
    const token = await user.generateToken()
    return res.json({ user, token })
  }
  res.status(401)
  throw new Error('Invalid email or password')
})

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const userExists = await User.findOne({ email: req.body.email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  const user = await User.create(req.body)
  sendMail(user, 'activate')

  if (user) {
    res.status(201).json({
      user,
      message:
        'Mail sent to your e-mail id for verification. Please confirm it.',
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc      Logout a user
// @route     GET /api/users/logout
// @access    Private
const logoutUser = asyncHandler(async (req, res) => {
  req.user.token = ''
  await req.user.save()

  res.status(200).json('logout successfully')
})

// @desc      Activate user account
// @route     GET /api/users/account/activate/:id
// @access    Public
const activateAccount = asyncHandler(async (req, res) => {
  const user = await User.findOne({ activationString: req.params.id })
  if (!user) {
    return res.send('link expired')
  }
  user.activationString = ''
  user.isAccountActive = true
  await user.save()
  res.send(`Account activated !!`)
})

// @desc      Send Email with temporary password to the user
// @route     POST /api/users/forgot/password
// @access    Public
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: 'No account found !!' })
  }
  sendMail(user, 'reset')
  user.password = 'Pwd$123'
  user.save()
  res.status(200).json({
    message: 'A mail with temporary password has been sent to your e-mail id',
  })
})

// @desc      View user profile
// @route     GET /api/users/profile/me
// @access    Private
const myProfile = asyncHandler(async (req, res) => {
  res.status(200).json(req.user)
})

// @desc      Update user profile
// @route     PUT /api/users/profile/me
// @access    Private
const updateProfile = asyncHandler(async (req, res) => {
  const updates = Object.keys(req.body)
  updates.forEach((update) => (req.user[update] = req.body[update]))
  await req.user.save()
  res.status(200).json(req.user)
})

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
  res.json(users)
})

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    await user.remove()
    res.json({ message: 'User removed' })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (user) {
    res.json(user)
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const updates = Object.keys(req.body)
  updates.forEach((update) => (user[update] = req.body[update]))
  await user.save()

  res.status(202).json(user)
})

module.exports = {
  loginUser,
  registerUser,
  activateAccount,
  logoutUser,
  forgotPassword,
  myProfile,
  updateProfile,
  getUsers,
  deleteUser,
  updateUser,
  getUserById,
}
