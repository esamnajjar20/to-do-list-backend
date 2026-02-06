import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { currentPassword, newPassword } = req.body;

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
};
