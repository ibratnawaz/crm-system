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

module.exports = { loginUser, registerUser, activateAccount, logoutUser }
