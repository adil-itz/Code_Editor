import jwt from 'jsonwebtoken';
import { 
  findUserByEmail, 
  createUser, 
  verifyPassword, 
  generateOTP,
  verifyOTP,
  resetUserPasswordWithOTP
} from '../db/userStore.js';

function signToken(userId) {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'devspace_super_secret_jwt_key_2026_x89f', 
    { expiresIn: '7d' }
  );
}

export async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await createUser({ name, email, password });
    const token = signToken(user.id);

    return res.status(201).json({
      message: 'Account created successfully.',
      token,
      user
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Signup failed.' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await verifyPassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = signToken(user.id || user._id);
    const { password: _, ...userWithoutPassword } = user;
    const role = userWithoutPassword.role || (userWithoutPassword.email?.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'user');

    return res.json({
      message: 'Login successful.',
      token,
      user: {
        ...userWithoutPassword,
        id: user.id || user._id?.toString(),
        role
      }
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Login failed.' });
  }
}

export async function sendOTPController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    const result = await generateOTP(email);

    return res.json({
      message: 'OTP has been sent to your email.',
      devOtp: result.devOtp
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to send OTP.' });
  }
}

export async function verifyOTPController(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and 6-digit OTP code are required.' });
    }

    await verifyOTP(email, otp);

    return res.json({
      message: 'OTP verified successfully.',
      verified: true
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'OTP verification failed.' });
  }
}

export async function resetPasswordOTPController(req, res) {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long.' });
    }

    const user = await resetUserPasswordWithOTP(email, otp, newPassword);
    const token = signToken(user.id);

    return res.json({
      message: 'Password reset successfully! You are now logged in.',
      token,
      user
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Password reset failed.' });
  }
}

export async function getMe(req, res) {
  return res.json({ user: req.user });
}
