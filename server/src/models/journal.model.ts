// src/models/journal.model.ts
import mongoose, { Document, Schema, Types } from 'mongoose';
import { ActivityCategory } from '../types';

interface IActivity {
  _id?: Types.ObjectId; // Add _id property
  action: string;
  category: ActivityCategory;
  expValue: number;
  date: Date;
}

interface IJournalEntry extends Document {
  userId: string;
  content: string;
  processedContent?: string;
  date: Date;
  expGained: number;
  activities: IActivity[];
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>({
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
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const journalEntrySchema = new Schema<IJournalEntry>({
  userId: {
    type: String,
    required: true,
    ref: 'User',
    index: true
  },
  content: {
    type: String,
    required: true
  },
  processedContent: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  expGained: {
    type: Number,
    default: 0
  },
  activities: [activitySchema]
}, {
  timestamps: true
});

// Create compound index on userId and date for faster queries
journalEntrySchema.index({ userId: 1, date: -1 });

const JournalEntry = mongoose.model<IJournalEntry>('JournalEntry', journalEntrySchema);

export { JournalEntry, IJournalEntry, IActivity };