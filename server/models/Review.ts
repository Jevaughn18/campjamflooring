import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});

// Index for efficient sorting
ReviewSchema.index({ createdAt: -1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
