import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema(
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
      default: false
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },

    dueDate: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

todoSchema.pre('save', function (next) {
  if (this.isModified('completed') && this.completed) {
    this.completedAt = new Date();
  }
  next();
});

todoSchema.methods.markAsCompleted = async function () {
  this.completed = true;
  return this.save();
};

export default mongoose.model('Todo', todoSchema);
