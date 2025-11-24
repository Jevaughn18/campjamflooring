import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

// Project 1 imports
import project1Thumbnail from "@/assets/project1/Project1Thumbnail.png";
import project1Img1 from "@/assets/project1/IMG_1.jpeg";
import project1Img2 from "@/assets/project1/IMG_2.jpeg";
import project1Img3 from "@/assets/project1/IMG_3.jpeg";
import project1Vid from "@/assets/project1/IMG_2819.mp4";

// Project 2 imports
import project2Thumbnail from "@/assets/project2/project2thumbnail.jpeg";
import project2Img1 from "@/assets/project2/img1.jpeg";
import project2Img2 from "@/assets/project2/img2.jpeg";
import project2Img3 from "@/assets/project2/img3.jpeg";
import project2Vid from "@/assets/project2/vid1.MP4";

// Project 3 imports
import project3Thumbnail from "@/assets/project3/thumbnail.jpeg";
import project3Pic1 from "@/assets/project3/pic1.jpeg";
import project3Pic2 from "@/assets/project3/pic2.jpeg";
import project3Pic3 from "@/assets/project3/pic3.jpeg";
import project3Vid from "@/assets/project3/project3vid.MP4";

// Project 4 imports
import project4Thumbnail from "@/assets/project4/thumbnail.jpeg";
import project4Tile1 from "@/assets/project4/tile1.jpeg";
import project4Tile2 from "@/assets/project4/tile2.jpeg";
import project4Tile3 from "@/assets/project4/tile3.jpeg";
import project4Vid from "@/assets/project4/vid2.MP4";

// Project 5 imports
import project5Thumbnail from "@/assets/project5/thumbnail.jpeg";
import project5Pic1 from "@/assets/project5/pic1.jpeg";
import project5Pic2 from "@/assets/project5/pic2.jpeg";
import project5Pic3 from "@/assets/project5/pic3.jpeg";
import project5Vid from "@/assets/project5/vid5.MP4";

// Project 6 imports
import project6Thumbnail from "@/assets/project6/thumbnail.jpeg";
import project6Pic1 from "@/assets/project6/pic1.jpeg";
import project6Pic2 from "@/assets/project6/pic2.jpeg";
import project6Pic3 from "@/assets/project6/pic3.jpeg";
import project6Vid from "@/assets/project6/vid6.MP4";

interface ProjectMedia {
  type: "image" | "video";
  src: string;
}

interface Project {
  id: number;
  title: string;
  thumbnail: string;
  media: ProjectMedia[];
}

const Gallery = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const projects: Project[] = [
    {
      id: 1,
      title: "Project #1",
      thumbnail: project1Thumbnail,
      media: [
        { type: "image", src: project1Img1 },
        { type: "image", src: project1Img2 },
        { type: "image", src: project1Img3 },
        { type: "video", src: project1Vid },
      ],
    },
    {
      id: 2,
      title: "Project #2",
      thumbnail: project2Thumbnail,
      media: [
        { type: "image", src: project2Img1 },
        { type: "image", src: project2Img2 },
        { type: "image", src: project2Img3 },
        { type: "video", src: project2Vid },
      ],
    },
    {
      id: 3,
      title: "Project #3",
      thumbnail: project3Thumbnail,
      media: [
        { type: "image", src: project3Pic1 },
        { type: "image", src: project3Pic2 },
        { type: "image", src: project3Pic3 },
        { type: "video", src: project3Vid },
      ],
    },
    {
      id: 4,
      title: "Project #4",
      thumbnail: project4Thumbnail,
      media: [
        { type: "image", src: project4Tile1 },
        { type: "image", src: project4Tile2 },
        { type: "image", src: project4Tile3 },
        { type: "video", src: project4Vid },
      ],
    },
    {
      id: 5,
      title: "Project #5",
      thumbnail: project5Thumbnail,
      media: [
        { type: "image", src: project5Pic1 },
        { type: "image", src: project5Pic2 },
        { type: "image", src: project5Pic3 },
        { type: "video", src: project5Vid },
      ],
    },
    {
      id: 6,
      title: "Project #6",
      thumbnail: project6Thumbnail,
      media: [
        { type: "image", src: project6Pic1 },
        { type: "image", src: project6Pic2 },
        { type: "image", src: project6Pic3 },
        { type: "video", src: project6Vid },
      ],
    },
  ];

  const openProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentMediaIndex(0);
  };

  const closeProject = () => {
    setSelectedProject(null);
    setCurrentMediaIndex(0);
  };

  const nextMedia = () => {
    if (selectedProject) {
      setCurrentMediaIndex((prev) =>
        prev === selectedProject.media.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevMedia = () => {
    if (selectedProject) {
      setCurrentMediaIndex((prev) =>
        prev === 0 ? selectedProject.media.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="projects" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Our Projects
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our portfolio of exceptional tiling and flooring projects
          </p>
        </div>

        {/* Gallery Grid - Project Thumbnails */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => openProject(project)}
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white font-semibold">{project.title}</h3>
                <span className="text-primary text-sm">
                  {project.media.length} {project.media.length === 1 ? 'item' : 'items'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Project Modal with Gallery */}
        {selectedProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={closeProject}
          >
            <div
              className="relative w-full h-full flex flex-col items-center justify-center p-2 sm:p-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:bg-white/20 z-10 w-10 h-10 sm:w-12 sm:h-12"
                onClick={closeProject}
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>

              {/* Project Title */}
              <div className="absolute top-2 left-2 sm:top-4 sm:left-4 text-white z-10 max-w-[60%] sm:max-w-none">
                <h3 className="text-lg sm:text-2xl font-bold truncate">{selectedProject.title}</h3>
                <p className="text-xs sm:text-sm text-white/80">
                  {currentMediaIndex + 1} / {selectedProject.media.length}
                </p>
              </div>

              {/* Media Display */}
              <div className="relative max-w-5xl max-h-[70vh] sm:max-h-[80vh] w-full flex items-center justify-center px-12 sm:px-16">
                {selectedProject.media[currentMediaIndex].type === "image" ? (
                  <img
                    src={selectedProject.media[currentMediaIndex].src}
                    alt={`${selectedProject.title} - ${currentMediaIndex + 1}`}
                    loading="eager"
                    decoding="async"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                ) : (
                  <video
                    src={selectedProject.media[currentMediaIndex].src}
                    controls
                    autoPlay
                    preload="metadata"
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                )}
              </div>

              {/* Navigation Buttons */}
              {selectedProject.media.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-10 h-10 sm:w-12 sm:h-12"
                    onClick={prevMedia}
                  >
                    <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 w-10 h-10 sm:w-12 sm:h-12"
                    onClick={nextMedia}
                  >
                    <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
                  </Button>
                </>
              )}

              {/* Thumbnail Navigation */}
              <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 overflow-x-auto max-w-[90%] sm:max-w-full px-2 sm:px-4 scrollbar-hide">
                {selectedProject.media.map((media, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentMediaIndex(index)}
                    className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      index === currentMediaIndex
                        ? "border-primary scale-110"
                        : "border-white/30 hover:border-white/60"
                    }`}
                  >
                    {media.type === "image" ? (
                      <img
                        src={media.src}
                        alt={`Thumbnail ${index + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black/50 flex items-center justify-center">
                        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
