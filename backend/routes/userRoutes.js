const express = require('express')
const {
  loginUser,
  registerUser,
  activateAccount,
  logoutUser,
} = require('../controllers/userController')
const { protect, verifyToken, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)
router.route('/account/activate/:id').get(activateAccount)
router.route('/logout').get([protect, verifyToken], logoutUser)

module.exports = router
