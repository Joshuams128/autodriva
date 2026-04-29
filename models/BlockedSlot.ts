import mongoose, { Schema, model, models } from 'mongoose';

export interface IBlockedSlot {
  _id: mongoose.Types.ObjectId;
  date: Date;
  timeSlot: string;
  reason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedSlotSchema = new Schema<IBlockedSlot>(
  {
    date: { type: Date, required: true, index: true },
    timeSlot: { type: String, required: true },
    reason: { type: String },
  },
  { timestamps: true }
);

BlockedSlotSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

const BlockedSlot =
  (models.BlockedSlot as mongoose.Model<IBlockedSlot>) ||
  model<IBlockedSlot>('BlockedSlot', BlockedSlotSchema);

export default BlockedSlot;
