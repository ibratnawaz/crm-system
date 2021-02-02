const express = require('express')
const {
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
} = require('../controllers/userController')
const { protect, verifyToken, admin } = require('../middleware/authMiddleware')

const router = express.Router()

router.route('/login').post(loginUser)
router.route('/register').post(registerUser)
router.route('/account/activate/:id').get(activateAccount)
router.route('/logout').get([protect, verifyToken], logoutUser)
router.route('/forgot/password').post(forgotPassword)
router
  .route('/profile/me')
  .get([protect, verifyToken], myProfile)
  .put([protect, verifyToken], updateProfile)

router.route('/all').get([protect, verifyToken, admin], getUsers)
router
  .route('/:id')
  .delete([protect, verifyToken, admin], deleteUser)
  .get([protect, verifyToken, admin], getUserById)
  .put([protect, verifyToken, admin], updateUser)
module.exports = router
