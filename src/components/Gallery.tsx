import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { galleryAPI, getImageUrl } from "@/lib/api";

interface ProjectMedia {
  type: "image" | "video";
  url: string;
}

interface Project {
  _id: string;
  title: string;
  description?: string;
  thumbnail: string;
  media: ProjectMedia[];
  category?: string;
}

const Gallery = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await galleryAPI.getAll();
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (project: Project) => {
    // If no media, create a temporary media array with just the thumbnail
    if (!project.media || project.media.length === 0) {
      const projectWithThumbnail = {
        ...project,
        media: [{ type: 'image' as const, url: project.thumbnail }]
      };
      setSelectedProject(projectWithThumbnail);
      setCurrentMediaIndex(0);
    } else {
      setSelectedProject(project);
      setCurrentMediaIndex(0);
    }
  };

  const closeModal = () => {
    setSelectedProject(null);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (selectedProject && currentMediaIndex < selectedProject.media.length - 1) {
      setCurrentMediaIndex(currentMediaIndex + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex(currentMediaIndex - 1);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") nextMedia();
    if (e.key === "ArrowLeft") prevMedia();
  };

  if (loading) {
    return (
      <section className="py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-background to-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Our Work</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our portfolio of completed projects
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="relative group cursor-pointer animate-pulse">
                <div className="aspect-square overflow-hidden rounded-xl soft-shadow bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Separate projects by category
  const tilingProjects = projects.filter(p => p.category === 'Tiling');
  const glassProjects = projects.filter(p => p.category === 'Glass Installations');

  return (
    <section className="py-20 px-4 sm:px-8 md:px-16 bg-gradient-to-b from-background to-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Our Work</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our portfolio of completed projects showcasing our expertise in flooring tiling and glass installations.
          </p>
        </div>

        {/* Tiling Section */}
        <div className="mb-16">
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">Tiling</h3>
          {tilingProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No tiling projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tilingProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => openModal(project)}
                  className="relative group cursor-pointer hover-lift"
                >
                  <div className="aspect-square overflow-hidden rounded-xl soft-shadow">
                    <img
                      src={getImageUrl(project.thumbnail)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Glass Installations Section */}
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-foreground">Glass Installations</h3>
          {glassProjects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No glass installation projects available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {glassProjects.map((project) => (
                <div
                  key={project._id}
                  onClick={() => openModal(project)}
                  className="relative group cursor-pointer hover-lift"
                >
                  <div className="aspect-square overflow-hidden rounded-xl soft-shadow">
                    <img
                      src={getImageUrl(project.thumbnail)}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
                      {project.description && (
                        <p className="text-sm text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {project.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        {selectedProject && selectedProject.media && selectedProject.media.length > 0 && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20"
              onClick={closeModal}
            >
              <X className="w-6 h-6" />
            </Button>

            <div
              className="relative max-w-5xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                {selectedProject.media[currentMediaIndex]?.type === "image" ? (
                  <img
                    src={getImageUrl(selectedProject.media[currentMediaIndex].url)}
                    alt={`${selectedProject.title} - Image ${currentMediaIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video
                    src={getImageUrl(selectedProject.media[currentMediaIndex].url)}
                    controls
                    autoPlay
                    className="w-full h-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                )}
              </div>

              {selectedProject.media.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
                    onClick={prevMedia}
                    disabled={currentMediaIndex === 0}
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 disabled:opacity-30"
                    onClick={nextMedia}
                    disabled={currentMediaIndex === selectedProject.media.length - 1}
                  >
                    <ChevronRight className="w-8 h-8" />
                  </Button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                    {currentMediaIndex + 1} / {selectedProject.media.length}
                  </div>
                </>
              )}

              <div className="mt-4 text-center text-white">
                <h3 className="text-2xl font-bold">{selectedProject.title}</h3>
                {selectedProject.description && (
                  <p className="text-white/80 mt-2">{selectedProject.description}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
