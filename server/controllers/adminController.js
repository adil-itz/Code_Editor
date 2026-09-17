import { getAllUsers, updateUserRole, deleteUser } from '../db/userStore.js';
import { isMongoConnected } from '../db/connect.js';

export async function getAdminStats(req, res) {
  try {
    const users = await getAllUsers();
    const totalUsers = users.length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;
    const totalRegularUsers = users.filter(u => u.role === 'user' || !u.role).length;

    const uptimeSeconds = process.uptime();
    const memoryUsage = process.memoryUsage();

    return res.json({
      totalUsers,
      totalAdmins,
      totalRegularUsers,
      databaseType: isMongoConnected() ? 'MongoDB Cloud' : 'JSON Local Store',
      uptimeSeconds,
      memoryUsageMB: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      serverStatus: 'Operational',
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch admin stats.' });
  }
}

export async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    return res.json({ users });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Failed to fetch users.' });
  }
}

export async function updateUserRoleController(req, res) {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified.' });
    }

    const updated = await updateUserRole(id, role);
    return res.json({ message: 'User role updated successfully.', user: updated });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to update user role.' });
  }
}

export async function deleteUserController(req, res) {
  try {
    const { id } = req.params;

    if (id === req.user.id || id === req.user._id) {
      return res.status(400).json({ message: 'Admin cannot delete their own active account.' });
    }

    await deleteUser(id);
    return res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    return res.status(400).json({ message: err.message || 'Failed to delete user.' });
  }
}
