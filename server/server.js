import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import executeRoutes from './routes/executeRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { connectDB } from './db/connect.js';
import { seedAdminUser } from './db/userStore.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/v1/projects', projectRoutes);
app.use('/api/projects', projectRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', server: 'DEVSPACE API Server', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, async () => {
  console.log(`DEVSPACE Server running on http://localhost:${PORT}`);
  await connectDB();
  await seedAdminUser();
});

