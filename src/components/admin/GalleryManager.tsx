import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Plus, Trash2, Edit, X, AlertTriangle, Image as ImageIcon } from "lucide-react";
import { galleryAPI, getImageUrl } from "@/lib/api";
import { ImageUpload } from "./ImageUpload";
import { MultiImageUpload } from "./MultiImageUpload";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface GalleryProject {
  _id: string;
  title: string;
  description: string | null;
  thumbnail: string;
  media: MediaItem[];
  category: string | null;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  thumbnail: string;
  media: MediaItem[];
  category: string;
}

export const GalleryManager = () => {
  const [projects, setProjects] = useState<GalleryProject[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    projectId: string | null;
    projectTitle: string;
  }>({ isOpen: false, projectId: null, projectTitle: "" });

  const formRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    thumbnail: "",
    media: [],
    category: "",
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const data = await galleryAPI.getAllAdmin();
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load gallery projects.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      thumbnail: "",
      media: [],
      category: "",
    });
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleEdit = (project: GalleryProject) => {
    console.log('Edit button clicked for project:', project);
    setFormData({
      title: project.title,
      description: project.description || "",
      thumbnail: project.thumbnail,
      media: project.media || [],
      category: project.category || "",
    });
    setEditingId(project._id);
    setIsAddingNew(false);
    console.log('Edit state set, editingId:', project._id);

    // Scroll to form after state update
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.thumbnail) {
      toast({
        title: "Error",
        description: "Please upload a thumbnail image.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.category) {
      toast({
        title: "Error",
        description: "Please select a category (Tiling or Glass Installations).",
        variant: "destructive",
      });
      return;
    }

    try {
      if (editingId) {
        // Update existing project
        await galleryAPI.update(editingId, {
          title: formData.title,
          description: formData.description || undefined,
          thumbnail: formData.thumbnail,
          media: formData.media,
          category: formData.category || undefined,
        });

        toast({
          title: "Success",
          description: "Project updated successfully!",
        });
      } else {
        // Create new project
        await galleryAPI.create({
          title: formData.title,
          description: formData.description || undefined,
          thumbnail: formData.thumbnail,
          media: formData.media,
          category: formData.category || undefined,
        });

        toast({
          title: "Success",
          description: "Project added successfully!",
        });
      }

      resetForm();
      fetchProjects();
    } catch (error: any) {
      console.error('Error saving project:', error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to save project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const openDeleteConfirm = (id: string, title: string) => {
    setDeleteConfirm({ isOpen: true, projectId: id, projectTitle: title });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ isOpen: false, projectId: null, projectTitle: "" });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.projectId) return;

    setDeletingId(deleteConfirm.projectId);
    closeDeleteConfirm();

    try {
      await galleryAPI.delete(deleteConfirm.projectId);

      setProjects(projects.filter(p => p._id !== deleteConfirm.projectId));
      toast({
        title: "Project Deleted",
        description: "The project has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const DeleteConfirmDialog = () => {
    if (!deleteConfirm.isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        onClick={closeDeleteConfirm}
      >
        <Card
          className="w-full max-w-md soft-shadow"
          onClick={(e) => e.stopPropagation()}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-destructive" />
              </div>
              <div className="min-w-0">
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Delete Project?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-muted p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-foreground font-semibold break-words">
                {deleteConfirm.projectTitle}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={closeDeleteConfirm}
                className="flex-1 w-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="flex-1 w-full"
              >
                Delete Project
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <>
      <DeleteConfirmDialog />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-semibold">Gallery Projects</h2>
          {!isAddingNew && !editingId && (
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>

        {(isAddingNew || editingId) && (
          <Card ref={formRef} className="soft-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetForm}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Thumbnail Image *</label>
                  <ImageUpload
                    currentImageUrl={formData.thumbnail}
                    onImageUploaded={(url) => setFormData({ ...formData, thumbnail: url })}
                    onImageRemoved={() => setFormData({ ...formData, thumbnail: "" })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Photos</label>
                  <MultiImageUpload
                    media={formData.media}
                    onMediaUpdate={(media) => setFormData({ ...formData, media })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Project Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Modern Kitchen Flooring"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the project (optional)"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">Select a category</option>
                    <option value="Tiling">Tiling</option>
                    <option value="Glass Installations">Glass Installations</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingId ? "Update Project" : "Add Project"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <Card key={project._id} className="soft-shadow overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={getImageUrl(project.thumbnail)}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  {project.category && (
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {project.category}
                    </div>
                  )}
                  {project.media && project.media.length > 0 && (
                    <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      +{project.media.length} photos
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{project.title}</h3>
                  {project.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(project)}
                      className="flex-1"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => openDeleteConfirm(project._id, project.title)}
                      disabled={deletingId === project._id}
                      className="flex-1"
                    >
                      {deletingId === project._id ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-lg text-muted-foreground mb-4">No gallery projects yet</p>
            <Button onClick={() => setIsAddingNew(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
