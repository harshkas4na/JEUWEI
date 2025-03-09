// src/models/user.model.ts
import mongoose, { Document, Schema } from 'mongoose';
import { UserStats, ActivityCategory } from '../types';

interface IUser extends Document {
  clerkId: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  totalExp: number;
  stats: {
    [key in ActivityCategory]: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userStatsSchema = new Schema<UserStats>({
  financial: {
    type: Number,
    default: 0
  },
  habits: {
    type: Number,
    default: 0
  },
  knowledge: {
    type: Number,
    default: 0
  },
  skills: {
    type: Number,
    default: 0
  },
  experiences: {
    type: Number,
    default: 0
  },
  network: {
    type: Number,
    default: 0
  }
});

const userSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  totalExp: {
    type: Number,
    default: 0
  },
  stats: {
    type: userStatsSchema,
    default: () => ({
      financial: 0,
      habits: 0,
      knowledge: 0,
      skills: 0,
      experiences: 0,
      network: 0
    })
  }
}, {
  timestamps: true
});

const User = mongoose.model<IUser>('User', userSchema);

export { User, IUser };