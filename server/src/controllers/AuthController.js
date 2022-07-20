import { IncomingForm } from 'formidable';
import { genSalt, hash, compare } from 'bcrypt';
import userModel from '../models/UserModel';
import { createToken } from '../utils/SecurityUtil';

const authController = {
  login: async (req, res) => {
    try {
      const form = new IncomingForm();

      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(500).json({
            msg: 'Network Error: Failed to login account, please try again later',
          });
        }
        const { username, password } = fields;

        const isAccountEmail = username.includes('@');

        if (isAccountEmail) {
          const user = await userModel.findOne({ username: username });

          if (!user) {
            return res.status(404).json({
              msg: `Account with this ${username} does not exist`,
            });
          }

          const isPasswordValid = await compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(404).json({
              msg: `Invalid credentials`,
            });
          }

          const tokenPayload = {
            _id: user._id,
            email: user.email,
            password: user.password,
          };

          const token = await createToken(tokenPayload);

          return res.status(200).json({ token: token });
        }

        return res.status(404).json({
          msg: `Account with this ${username} is require email`,
        });
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  register: async (req, res) => {
    try {
      const form = new IncomingForm();

      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(500).json({
            msg: 'Network Error: Failed to create account, please try again later',
          });
        }

        const { username, email, password } = fields;
        const salt = await genSalt(15);
        const hashedPassword = await hash(password, salt);

        const newAccount = new userModel({
          username,
          email,
          password: hashedPassword,
        });

        const savedAccount = await newAccount.save();
        return res.status(201).json({
          msg: 'Account created successfully',
          account: savedAccount,
        });
      });
    } catch (error) {
      return res.status(500).json({
        msg: error.message,
      });
    }
  },
  forgotPassword: async (req, res) => {
    try {
      const form = new IncomingForm();

      form.parse(req, async (error, fields, files) => {
        if (error) {
          return res.status(500).json({
            msg: 'Network Error. Please try again',
          });
        }

        const { email, password } = fields;

        if (!email || !password) {
          return res
            .status(400)
            .json({ msg: 'All fields is require to reset password' });
        }

        const user = await userModel.findOne({ email: email });

        if (!user) {
          return res
            .status(400)
            .json({ msg: `Account with this ${email} does not exist` });
        }

        const salt = await genSalt(15);
        const hashedPassword = await hash(password, salt);

        const updatedAccount = await userModel.findOneAndUpdate(
          { email: email },
          {
            password: hashedPassword,
          },
          {
            new: true,
          }
        );

        return res.status(200).json({
          msg: 'Account reset password successfully',
          account: updatedAccount,
        });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

export default authController;
