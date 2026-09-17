import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { isMongoConnected } from './connect.js';
import { sendOTPEmail } from '../services/emailService.js';

const dataDir = path.resolve(process.cwd(), 'data');
const usersFilePath = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([], null, 2));
}

function readUsers() {
  try {
    const raw = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

export async function findUserByEmail(email) {
  if (isMongoConnected()) {
    return await User.findOne({ email: email.toLowerCase() }).lean();
  }
  const users = readUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export async function findUserById(id) {
  if (isMongoConnected()) {
    return await User.findById(id).lean();
  }
  const users = readUsers();
  return users.find(u => u.id === id);
}

export async function createUser({ name, email, password, role = 'user' }) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  if (isMongoConnected()) {
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      throw new Error('User already exists with this email.');
    }
    const doc = await User.create({
      name,
      email: email.toLowerCase(),
      password: passwordHash,
      role
    });
    return doc.toJSON();
  }

  const users = readUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('User already exists with this email.');
  }

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password: passwordHash,
    role: role || 'user',
    createdAt: new Date().toISOString(),
    resetToken: null,
    resetTokenExpiry: null,
    otp: null,
    otpExpiry: null
  };

  users.push(newUser);
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function verifyPassword(plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword);
}

export async function generateOTP(email) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 600000);

  if (isMongoConnected()) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      throw new Error('No account found with this email address.');
    }
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();
  } else {
    const users = readUsers();
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      throw new Error('No account found with this email address.');
    }
    users[index].otp = otp;
    users[index].otpExpiry = Date.now() + 600000;
    writeUsers(users);
  }

  const emailRes = await sendOTPEmail(email.toLowerCase(), otp);
  return { otp, devOtp: emailRes.devOtp };
}

export async function verifyOTP(email, otp) {
  if (isMongoConnected()) {
    const user = await User.findOne({
      email: email.toLowerCase(),
      otp: otp,
      otpExpiry: { $gt: new Date() }
    });
    if (!user) {
      throw new Error('Invalid or expired OTP code.');
    }
    return true;
  }

  const users = readUsers();
  const user = users.find(u =>
    u.email.toLowerCase() === email.toLowerCase() &&
    u.otp === otp &&
    u.otpExpiry > Date.now()
  );
  if (!user) {
    throw new Error('Invalid or expired OTP code.');
  }
  return true;
}

export async function resetUserPasswordWithOTP(email, otp, newPassword) {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  if (isMongoConnected()) {
    const user = await User.findOne({
      email: email.toLowerCase(),
      otp: otp,
      otpExpiry: { $gt: new Date() }
    });

    if (!user) {
      throw new Error('Invalid or expired OTP code.');
    }

    user.password = passwordHash;
    user.otp = null;
    user.otpExpiry = null;
    await user.save();
    return user.toJSON();
  }

  const users = readUsers();
  const index = users.findIndex(u =>
    u.email.toLowerCase() === email.toLowerCase() &&
    u.otp === otp &&
    u.otpExpiry > Date.now()
  );

  if (index === -1) {
    throw new Error('Invalid or expired OTP code.');
  }

  users[index].password = passwordHash;
  users[index].otp = null;
  users[index].otpExpiry = null;
  writeUsers(users);

  const { password: _, ...userWithoutPassword } = users[index];
  return userWithoutPassword;
}

export async function seedAdminUser() {
  const adminEmail = 'admin@gmail.com';
  const adminPassword = '1234567890';
  const adminName = 'Admin';

  const existing = await findUserByEmail(adminEmail);
  if (!existing) {
    console.log('[SEED] Creating default Admin user (admin@gmail.com)...');
    await createUser({
      name: adminName,
      email: adminEmail,
      password: adminPassword,
      role: 'admin'
    });
    console.log('[SEED] Default Admin user created successfully.');
  } else if (existing.role !== 'admin') {
    console.log('[SEED] Updating existing user admin@gmail.com to role: admin...');
    await updateUserRole(existing.id || existing._id, 'admin');
  }
}

export async function getAllUsers() {
  if (isMongoConnected()) {
    const users = await User.find({}).lean();
    return users.map(u => {
      const { password, otp, otpExpiry, ...rest } = u;
      return { ...rest, id: u._id.toString() };
    });
  }

  const users = readUsers();
  return users.map(({ password, otp, otpExpiry, ...user }) => user);
}

export async function updateUserRole(id, role) {
  if (isMongoConnected()) {
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).lean();
    if (!user) throw new Error('User not found');
    const { password, otp, otpExpiry, ...rest } = user;
    return { ...rest, id: user._id.toString() };
  }

  const users = readUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');

  users[index].role = role;
  writeUsers(users);

  const { password, otp, otpExpiry, ...updatedUser } = users[index];
  return updatedUser;
}

export async function deleteUser(id) {
  if (isMongoConnected()) {
    const res = await User.findByIdAndDelete(id);
    if (!res) throw new Error('User not found');
    return true;
  }

  const users = readUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) throw new Error('User not found');

  writeUsers(filtered);
  return true;
}

