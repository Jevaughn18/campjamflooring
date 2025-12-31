import express, { Request, Response } from 'express';
import GalleryProject from '../models/GalleryProject';
import { auth, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all published projects (public)
router.get('/', async (req: Request, res: Response) => {
  try {
    const projects = await GalleryProject.find({ isPublished: true })
      .sort({ displayOrder: -1, createdAt: -1 })
      .select('-__v');

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get all projects (admin only)
router.get('/all', auth, async (req: Request, res: Response) => {
  try {
    const projects = await GalleryProject.find()
      .sort({ displayOrder: -1, createdAt: -1 })
      .select('-__v');

    res.json({ projects });
  } catch (error) {
    console.error('Error fetching all projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const project = await GalleryProject.findById(req.params.id).select('-__v');

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create project (admin only)
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, thumbnail, media, category } = req.body;

    if (!title || !thumbnail) {
      return res.status(400).json({ error: 'Title and thumbnail are required' });
    }

    const project = new GalleryProject({
      title,
      description,
      thumbnail,
      media: media || [],
      category,
    });

    await project.save();

    res.status(201).json({ success: true, project });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project (admin only)
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, thumbnail, media, category, displayOrder, isPublished } = req.body;

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (thumbnail !== undefined) updateData.thumbnail = thumbnail;
    if (media !== undefined) updateData.media = media;
    if (category !== undefined) updateData.category = category;
    if (displayOrder !== undefined) updateData.displayOrder = displayOrder;
    if (isPublished !== undefined) updateData.isPublished = isPublished;

    const project = await GalleryProject.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, project });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project (admin only)
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const project = await GalleryProject.findByIdAndDelete(req.params.id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

export default router;
