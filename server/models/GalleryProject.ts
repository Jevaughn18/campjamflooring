import mongoose, { Document, Schema } from 'mongoose';

export interface IMedia {
  type: 'image' | 'video';
  url: string;
}

export interface IGalleryProject extends Document {
  title: string;
  description?: string;
  thumbnail: string;
  media: IMedia[];
  category?: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryProjectSchema = new Schema<IGalleryProject>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  thumbnail: {
    type: String,
    required: true,
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video'],
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  }],
  category: {
    type: String,
    trim: true,
  },
  displayOrder: {
    type: Number,
    default: 0,
  },
  isPublished: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for efficient sorting
GalleryProjectSchema.index({ displayOrder: -1, createdAt: -1 });
GalleryProjectSchema.index({ isPublished: 1 });

export default mongoose.model<IGalleryProject>('GalleryProject', GalleryProjectSchema);
