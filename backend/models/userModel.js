const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },
    last_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      default: 'employee',
    },
    isRightsGiven: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAccountActive: {
      type: Boolean,
      required: true,
      default: false,
    },
    activationString: {
      type: String,
      default: '',
    },
    token: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.token
  delete userObject.activationString

  return userObject
}

// generate token
userSchema.methods.generateToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })

  user.token = token
  await user.save()

  return token
}

// Check plain text password matching with the saved hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password)
}

// Hash the plain text password before saving
userSchema.pre('save', async function (next) {
  const user = this

  if (user.isModified('password')) {
    let salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)
  }

  next()
})

const User = mongoose.model('User', userSchema)
module.exports = User
