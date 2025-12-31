import express, { Request, Response } from 'express';
import Review from '../models/Review';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all reviews (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .select('-__v');

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Create review (public)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: 'Name, rating, and comment are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const review = new Review({
      name,
      rating,
      comment,
    });

    await review.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Delete review (admin only)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
