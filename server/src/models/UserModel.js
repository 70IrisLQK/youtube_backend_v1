import { Schema, model } from 'mongoose'

const userSchema = new Schema({
  username: {
    type: String,
    require: [true, 'Username is require to create account'],
    unique: [true, 'Account with this username already exist'],
  },
  email: {
    type: String,
    require: [true, 'Email is require to create account'],
    unique: [true, 'Email with this email already exist'],
  },
  password: {
    type: String,
    require: [true, 'Password is require to create account'],
    minLength: 6,
  },
  videos: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Video',
    },
  ],
  subscribers: {
    type: Array,
    default: [],
  },
  userSubscribedChannel: {
    type: Array,
    default: [],
  },
})

const userModel = model('User', userSchema)

export default userModel
