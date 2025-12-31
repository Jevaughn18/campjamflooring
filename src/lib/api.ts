import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const SERVER_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

// Helper to convert relative image URLs to absolute URLs
export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${SERVER_URL}${path}`;
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // You can add redirect logic here if needed
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: async () => {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  createAdmin: async (email: string, password: string) => {
    const response = await api.post('/auth/create-admin', { email, password });
    return response.data;
  },
};

// Gallery API
export const galleryAPI = {
  getAll: async () => {
    const response = await api.get('/gallery');
    return response.data.projects;
  },

  getAllAdmin: async () => {
    const response = await api.get('/gallery/all');
    return response.data.projects;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/gallery/${id}`);
    return response.data.project;
  },

  create: async (projectData: {
    title: string;
    description?: string;
    thumbnail: string;
    media?: Array<{ type: 'image' | 'video'; url: string }>;
    category?: string;
  }) => {
    const response = await api.post('/gallery', projectData);
    return response.data.project;
  },

  update: async (
    id: string,
    projectData: {
      title?: string;
      description?: string;
      thumbnail?: string;
      media?: Array<{ type: 'image' | 'video'; url: string }>;
      category?: string;
      displayOrder?: number;
      isPublished?: boolean;
    }
  ) => {
    const response = await api.put(`/gallery/${id}`, projectData);
    return response.data.project;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getAll: async () => {
    const response = await api.get('/reviews');
    return response.data.reviews;
  },

  create: async (reviewData: { name: string; rating: number; comment: string }) => {
    const response = await api.post('/reviews', reviewData);
    return response.data.review;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/reviews/${id}`);
    return response.data;
  },
};

// Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteImage: async (filename: string) => {
    const response = await api.delete(`/upload/${filename}`);
    return response.data;
  },
};
