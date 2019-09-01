const mg = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')

const userSchema = new mg.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('Age must be a positive number')
            }
        }
    },
    Email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,

        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    Password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (value.length() < 6) {
                throw new Error('passoword should be greater than 6 digits')
            }
        },
        validate(value) {
            if (value.includes('password')) {
                throw new Error('should not contain "password" ')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
},
    {
        timestamps: true
    })

userSchema.virtual('tasks', {
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function () {

    const user = this
    const userObject = user.toObject()
    delete userObject.Password
    delete userObject.tokens
    delete userObject.avatar
    return userObject


}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user._id.toString() }, 'mynewcourse')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (Email, Password) => {
    const user = await User.findOne({ Email })
    if (!user) {
        throw new Error('Unable to login!')
    }

    const isMatch = await bcrypt.compare(Password, user.Password)
    if (!isMatch) {
        throw new Error('Unable to login!')
    }

    return user
}

//hashing the password before saving
userSchema.pre('save', async function (next) {
    const user = this

    if (user.isModified('Password')) {
        user.Password = await bcrypt.hash(user.Password, 8)
    }
    next()
})

userSchema.pre('remove', async function (next) {
    const user = this
    await Tasks.deleteMany({ owner: user.id })
    next()
})
const User = mg.model('User', userSchema)

module.exports = User 