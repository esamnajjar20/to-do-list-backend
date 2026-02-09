import mongoose from 'mongoose';

/**
 * Task schema representing a to-do item.
 */
const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title is too long']
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500
    },
    completed: {
      type: Boolean,
      default: false,
      index: true
    },
    completedAt: {
      type: Date
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    dueDate: {
      type: Date,
      index: true
    },
    reminderAt: {
      type: Date
    },
    sharedWith: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        permission: {
          type: String,
          enum: ['read', 'write'],
          default: 'read'
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

taskSchema.pre('save', function (next) {
  if (this.isModified('completed') && this.completed && !this.completedAt) {
    this.completedAt = new Date();
  }
  next();
});

/**
 * Mark task as completed.
 * @returns {Promise<mongoose.Document>}
 */
taskSchema.methods.markAsCompleted = async function () {
  this.completed = true;
  this.completedAt = new Date();
  return this.save();
};

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.index({ 'sharedWith.user': 1 });

export default mongoose.model('Task', taskSchema);
