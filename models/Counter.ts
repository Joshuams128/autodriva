import mongoose, { Schema, model, models } from 'mongoose';

export interface ICounter {
  _id: string;
  seq: number;
}

const CounterSchema = new Schema<ICounter>({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 },
});

export async function nextSequence(name: string): Promise<number> {
  const Counter = models.Counter || model<ICounter>('Counter', CounterSchema);
  const result = await Counter.findByIdAndUpdate(
    name,
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return result.seq;
}

const Counter = (models.Counter as mongoose.Model<ICounter>) || model<ICounter>('Counter', CounterSchema);
export default Counter;
