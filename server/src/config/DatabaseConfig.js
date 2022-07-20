import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI = process.env.MONGO_URI

const connectDatabase = () => {
  try {
    mongoose
      .connect(MONGO_URI)
      .then(() => {
        console.log('Connect DB success!')
      })
      .catch((error) => {
        console.log('Connect DB failed at ', error.message)
      })
  } catch (error) {
    console.log(error.message)
  }
}

export default connectDatabase
