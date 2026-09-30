import jwt from 'jsonwebtoken';
import { 
  findUserByEmail, 
  createUser, 
  verifyPassword, 
  generateOTP,
  verifyOTP,
  updateUser2FA,
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

    if (user.is2FAEnabled) {
      await generateOTP(email);
      return res.json({
        require2FA: true,
        email: user.email,
        message: 'Two-Factor Authentication is enabled. A 6-digit OTP has been sent to your email.'
      });
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

export async function verify2FACode(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and 2FA OTP code are required.' });
    }

    await verifyOTP(email, otp);

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = signToken(user.id || user._id);
    const { password: _, ...userWithoutPassword } = user;
    const role = userWithoutPassword.role || (userWithoutPassword.email?.toLowerCase() === 'admin@gmail.com' ? 'admin' : 'user');

    return res.json({
      message: '2FA verified. Login successful.',
      token,
      user: {
        ...userWithoutPassword,
        id: user.id || user._id?.toString(),
        role
      }
    });
  } catch (err) {
    return res.status(400).json({ message: err.message || '2FA OTP verification failed.' });
  }
}

export async function toggle2FAController(req, res) {
  try {
    const { is2FAEnabled, otp } = req.body;
    const userId = req.user.id || req.user._id;

    if (is2FAEnabled) {
      if (!otp) {
        await generateOTP(req.user.email);
        return res.json({
          requireOTP: true,
          message: 'An OTP has been sent to your email to confirm enabling 2FA.'
        });
      }

      await verifyOTP(req.user.email, otp);
      const updatedUser = await updateUser2FA(userId, true);
      return res.json({
        message: 'Two-Factor Authentication has been enabled successfully.',
        is2FAEnabled: true,
        user: updatedUser
      });
    } else {
      const updatedUser = await updateUser2FA(userId, false);
      return res.json({
        message: 'Two-Factor Authentication has been disabled.',
        is2FAEnabled: false,
        user: updatedUser
      });
    }
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to update 2FA settings.' });
  }
}

export async function sendOTPController(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email address is required.' });
    }

    await generateOTP(email);

    return res.json({
      message: 'OTP has been sent to your email.'
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
