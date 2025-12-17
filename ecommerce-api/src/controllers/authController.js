import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const generateToken = (userId, displayName, role) => {
  return jwt.sign({ userId, displayName, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  )
}

const generateRefreshToken = (userId) => {
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { token: refreshToken, userId };
};

const generatePassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
}

const checkUserExist = async (email) => {
  const user = await User.findOne({ email });
  return user;
}


async function register(req, res, next) {
  try {
    const { displayName, email, password, phone } = req.body;
    const userExist = await checkUserExist(email);
    if (userExist) {
      return res.status(400).json({ message: 'User already exist' });
    }
    let role = 'customer';
    const hashPassword = await generatePassword(password);
    const newUser = new User({
      displayName,
      email,
      hashPassword,
      role,
      phone
    });
  
    await newUser.save();
    res.status(201).json({ displayName, email, phone });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userExist = await checkUserExist(email);
    if (!userExist) {
      return res.status(400).json({ message: 'User does not exist. You must to sign in' });
    }
    console.log(userExist);
    const isMatch = await bcrypt.compare(password, userExist.hashPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(userExist._id, userExist.displayName, userExist.role);
    const refreshToken = generateRefreshToken(userExist._id);
    res.status(200).json({ token, refreshToken:refreshToken.token });
  } catch (error) {
    console.log(error);
    next(error);
  }
}
const checkEmailAlredyRegistered = async (req, res, next) => {
  try {
    const { email } = req.query;
    console.log(email);
    const user = await User.findOne({email});
    res.status(200).json({ exists: !!user });
  } catch (error) {
    next(error)
  }
};
const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);
    if (user) {
      const newToken = generateToken(user._id, user.name, user.role);

      res.status(200).json({ token: newToken });
    } else {
      res.status(401).json({ message: 'Invalid refresh token' });
    }
  } catch (error) {
    next(error);
  }
};

export { register, login,checkEmailAlredyRegistered, refreshToken };


