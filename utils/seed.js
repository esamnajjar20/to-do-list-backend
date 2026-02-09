import dotenv from 'dotenv';
import { connectDB } from '../config/connectDB.js';
import User from '../models/User.js';
import Task from '../models/Task.js';

dotenv.config();

const run = async () => {
  await connectDB();

  const reset = process.env.SEED_RESET === 'true';
  if (reset) {
    await Task.deleteMany({});
    await User.deleteMany({});
  }

  const email = process.env.SEED_USER_EMAIL || 'demo@example.com';
  const password = process.env.SEED_USER_PASSWORD || 'password123';

  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ username: 'demo', email, password });
  }

  const tasks = [
    {
      user: user._id,
      title: 'Welcome task',
      description: 'This is a seeded task.',
      priority: 'medium',
      tags: ['seed', 'welcome']
    },
    {
      user: user._id,
      title: 'High priority example',
      description: 'Finish the documentation update.',
      priority: 'high',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      tags: ['docs']
    }
  ];

  await Task.insertMany(tasks);

  console.log('Seed completed');
  process.exit(0);
};

run().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
