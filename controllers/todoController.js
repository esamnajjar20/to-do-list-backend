import Task from '../models/Task.js';

/**
 * Build access filter for a user.
 * @param {string} userId
 * @param {boolean} includeShared
 * @returns {object}
 */
const buildAccessFilter = (userId, includeShared) => {
  const or = [{ user: userId }];
  if (includeShared) {
    or.push({
      sharedWith: {
        $elemMatch: {
          user: userId,
          permission: { $in: ['read', 'write'] }
        }
      }
    });
  }
  return { $or: or };
};

/**
 * Build query filters from request parameters.
 * @param {import('express').Request} req
 * @returns {object}
 */
const buildQueryFilters = (req) => {
  const includeShared = req.query.includeShared === 'true';
  const filters = [buildAccessFilter(req.user._id, includeShared)];

  if (req.query.completed === 'true' || req.query.completed === 'false') {
    filters.push({ completed: req.query.completed === 'true' });
  }

  if (req.query.priority) {
    filters.push({ priority: req.query.priority });
  }

  if (req.query.tag) {
    filters.push({ tags: req.query.tag });
  }

  if (req.query.q) {
    const regex = new RegExp(req.query.q, 'i');
    filters.push({ $or: [{ title: regex }, { description: regex }] });
  }

  if (req.query.createdFrom || req.query.createdTo) {
    const createdAt = {};
    if (req.query.createdFrom) createdAt.$gte = new Date(req.query.createdFrom);
    if (req.query.createdTo) createdAt.$lte = new Date(req.query.createdTo);
    filters.push({ createdAt });
  }

  if (req.query.dueFrom || req.query.dueTo) {
    const dueDate = {};
    if (req.query.dueFrom) dueDate.$gte = new Date(req.query.dueFrom);
    if (req.query.dueTo) dueDate.$lte = new Date(req.query.dueTo);
    filters.push({ dueDate });
  }

  return { $and: filters };
};

/**
 * Get tasks for current user.
 */
export const getTodos = async (req, res) => {
  try {
    const query = buildQueryFilters(req);
    const todos = await Task.find(query).sort({ createdAt: -1 });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Get a task by id.
 */
export const getTodoById = async (req, res) => {
  try {
    const access = buildAccessFilter(req.user._id, true);
    const todo = await Task.findOne({ _id: req.params.id, ...access });
    if (!todo) return res.status(404).json({ message: 'Task not found' });
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Create a new task.
 */
export const createTodo = async (req, res) => {
  try {
    const { title, description, priority, dueDate, tags, reminderAt } = req.body;

    const todo = await Task.create({
      user: req.user._id,
      title,
      description,
      priority,
      dueDate,
      tags,
      reminderAt
    });

    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Update an existing task.
 */
export const updateTodo = async (req, res) => {
  try {
    const allowedFields = [
      'title',
      'description',
      'completed',
      'priority',
      'dueDate',
      'tags',
      'reminderAt'
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (field in req.body) updates[field] = req.body[field];
    }

    if (typeof updates.completed === 'boolean' && updates.completed) {
      updates.completedAt = new Date();
    }

    const todo = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { user: req.user._id },
          {
            sharedWith: {
              $elemMatch: {
                user: req.user._id,
                permission: 'write'
              }
            }
          }
        ]
      },
      updates,
      { new: true, runValidators: true }
    );

    if (!todo) return res.status(404).json({ message: 'Task not found or not yours' });

    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Delete a task (owner only).
 */
export const deleteTodo = async (req, res) => {
  try {
    const todo = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Task not found or not yours' });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Mark a task as completed.
 */
export const markTodoCompleted = async (req, res) => {
  try {
    const todo = await Task.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        {
          sharedWith: {
            $elemMatch: { user: req.user._id, permission: 'write' }
          }
        }
      ]
    });
    if (!todo) return res.status(404).json({ message: 'Task not found or not yours' });

    await todo.markAsCompleted();
    res.json({ message: 'Task marked as completed', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Share a task with another user (owner only).
 */
export const shareTodo = async (req, res) => {
  try {
    const { userId, permission = 'read' } = req.body;

    const todo = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Task not found or not yours' });

    const existing = todo.sharedWith.find((s) => String(s.user) === String(userId));
    if (existing) {
      existing.permission = permission;
    } else {
      todo.sharedWith.push({ user: userId, permission });
    }

    await todo.save();
    res.json({ message: 'Task shared successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Unshare a task with a user (owner only).
 */
export const unshareTodo = async (req, res) => {
  try {
    const todo = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!todo) return res.status(404).json({ message: 'Task not found or not yours' });

    todo.sharedWith = todo.sharedWith.filter(
      (s) => String(s.user) !== String(req.params.userId)
    );
    await todo.save();

    res.json({ message: 'Task unshared successfully', todo });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * Weekly analytics for completed tasks (last 7 days).
 */
export const getWeeklyStats = async (req, res) => {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 7);

    const stats = await Task.aggregate([
      {
        $match: {
          user: req.user._id,
          completed: true,
          completedAt: { $gte: start, $lte: end }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ range: { start, end }, stats });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
