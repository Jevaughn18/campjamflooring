import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

// Import your images
import tile1 from "@/assets/tile1.jpeg";
import tile2 from "@/assets/tile2.jpeg";
import tile3 from "@/assets/tile3.jpeg";
import tile4 from "@/assets/tile4.jpeg";
import tile5 from "@/assets/tile5.jpeg";
import tile6 from "@/assets/tile6.jpeg";

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");
  const videoRefs = useRef<{ [key: number]: HTMLVideoElement | null }>({});
  const [playingVideos, setPlayingVideos] = useState<{ [key: number]: boolean }>({});

  // Debug: Check if videos are loading
  useEffect(() => {
    galleryItems.forEach(item => {
      if (item.type === "video") {
        console.log(`Video ${item.id}:`, item.media);
        
        // Test if video URL is accessible
        fetch(item.media)
          .then(response => {
            console.log(`Video ${item.id} status:`, response.status);
          })
          .catch(error => {
            console.error(`Video ${item.id} error:`, error);
          });
      }
    });
  }, []);

  // Your gallery items
  const galleryItems = [
    {
      id: 1,
      title: "Project #1",
      category: "Pictures",
      type: "image",
      media: tile1,
    },
    {
      id: 2,
      title: "Project #2",
      category: "Pictures",
      type: "image",
      media: tile2,
    },
    {
      id: 3,
      title: "Project #3",
      category: "Pictures",
      type: "image",
      media: tile3,
    },
    {
      id: 4,
      title: "Project #4",
      category: "Pictures",
      type: "image",
      media: tile4,
    },
    {
      id: 5,
      title: "Project #5",
      category: "Pictures",
      type: "image",
      media: tile5,
    },
    {
      id: 6,
      title: "Project #6",
      category: "Pictures",
      type: "image",
      media: tile6,
    },
    {
      id: 7,
      title: "Project #7",
      category: "Videos",
      type: "video",
      media: "/vid1.MP4",
      thumbnail: tile4,
    },
    {
      id: 8,
      title: "Project #8",
      category: "Videos",
      type: "video",
      media: "/vid2.MP4",
      thumbnail: tile1,
    },
    {
      id: 9,
      title: "Project #9",
      category: "Videos",
      type: "video",
      media: "/vid3.MP4",
      thumbnail: tile6,
    },
  ];

  const categories = ["All", "Pictures", "Videos"];

  const filteredItems = filter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const handleMouseEnter = (itemId: number) => {
    const video = videoRefs.current[itemId];
    console.log("Mouse enter, video:", video);
    if (video) {
      video.currentTime = 0;
      video.play()
        .then(() => {
          setPlayingVideos(prev => ({ ...prev, [itemId]: true }));
        })
        .catch(error => {
          console.log("Video play failed:", error);
        });
    }
  };

  const handleMouseLeave = (itemId: number) => {
    const video = videoRefs.current[itemId];
    if (video) {
      video.pause();
      video.currentTime = 0;
      setPlayingVideos(prev => ({ ...prev, [itemId]: false }));
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

        {/* Filter Buttons */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl bg-card shadow-lg cursor-pointer transform transition-all duration-300 hover:scale-105"
              onClick={() => item.type === "image" && setSelectedImage(item.media)}
              onMouseEnter={() => item.type === "video" && handleMouseEnter(item.id)}
              onMouseLeave={() => item.type === "video" && handleMouseLeave(item.id)}
            >
              <div className="aspect-square overflow-hidden">
                {item.type === "image" ? (
                  <img
                    src={item.media}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    {/* Video element - always visible but starts paused */}
                    <video
                      ref={el => {
                        videoRefs.current[item.id] = el;
                        console.log(`Video ref ${item.id} set:`, el);
                      }}
                      src={item.media}
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Thumbnail overlay - only shows when video is NOT playing */}
                    {!playingVideos[item.id] && (
                      <div className="absolute inset-0">
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        {/* Play icon overlay */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <div className="bg-black/50 rounded-full p-4">
                            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white font-semibold">{item.title}</h3>
                <span className="text-primary text-sm">{item.category}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90" onClick={() => setSelectedImage(null)}>
            <div className="relative max-w-4xl max-h-[90vh] mx-4">
              <img
                src={selectedImage}
                alt="Gallery item"
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-white hover:bg-white/20"
                onClick={() => setSelectedImage(null)}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;