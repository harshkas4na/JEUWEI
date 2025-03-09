// src/models/exp.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ActivityCategory } from '../types';

interface IExpActivity {
  action: string;
  category: ActivityCategory;
  expValue: number;
}

interface IExpHistory extends Document {
  userId: string;
  date: Date;
  totalExp: number;
  levelUp: boolean;
  newLevel?: number;
  activities: IExpActivity[];
  categoryExp: {
    [key in ActivityCategory]?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const expActivitySchema = new Schema<IExpActivity>({
  action: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['financial', 'habits', 'knowledge', 'skills', 'experiences', 'network'],
    required: true
  },
  expValue: {
    type: Number,
    required: true
  }
});

const expHistorySchema = new Schema<IExpHistory>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  totalExp: {
    type: Number,
    required: true
  },
  levelUp: {
    type: Boolean,
    default: false
  },
  newLevel: {
    type: Number
  },
  activities: [expActivitySchema],
  categoryExp: {
    financial: Number,
    habits: Number,
    knowledge: Number,
    skills: Number,
    experiences: Number,
    network: Number
  }
}, {
  timestamps: true
});

// Create compound index on userId and date for faster queries
expHistorySchema.index({ userId: 1, date: -1 });

const ExpHistory = mongoose.model<IExpHistory>('ExpHistory', expHistorySchema);

export { ExpHistory, IExpHistory, IExpActivity };