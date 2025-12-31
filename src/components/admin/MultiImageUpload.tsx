import { useState } from "react";
import { Upload, X, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadAPI, getImageUrl } from "@/lib/api";
import { toast } from "@/components/ui/use-toast";

interface MediaItem {
  type: 'image' | 'video';
  url: string;
}

interface MultiImageUploadProps {
  media: MediaItem[];
  onMediaUpdate: (media: MediaItem[]) => void;
}

export const MultiImageUpload = ({ media, onMediaUpdate }: MultiImageUploadProps) => {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file: File) => {
    try {
      setUploading(true);

      // Check if already at max capacity (4 items)
      if (media.length >= 4) {
        throw new Error('Maximum of 4 photos allowed per project');
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Please upload a valid image file (JPEG, PNG, or WebP)');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Image size must be less than 10MB');
      }

      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.imageUrl;

      // Add to media array
      const newMedia = [...media, { type: 'image' as const, url: imageUrl }];
      onMediaUpdate(newMedia);

      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      });
    } catch (error: any) {
      console.error('Error uploading image:', error);
      toast({
        title: "Upload Failed",
        description: error.response?.data?.error || error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      uploadImage(e.target.files[0]);
    }
  };

  const handleRemove = (index: number) => {
    const newMedia = media.filter((_, i) => i !== index);
    onMediaUpdate(newMedia);

    toast({
      title: "Success",
      description: "Image removed successfully!",
    });
  };

  return (
    <div className="space-y-4">
      {media.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Current Photos ({media.length})</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {media.map((item, index) => (
              <div key={index} className="relative group">
                {item.type === 'image' ? (
                  <img
                    src={getImageUrl(item.url)}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border-2 border-border"
                  />
                ) : (
                  <div className="w-full h-24 bg-muted rounded-lg flex items-center justify-center border-2 border-border">
                    <Video className="w-6 h-6 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center">
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemove(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="absolute bottom-1 left-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload new image button */}
      {media.length < 4 && (
        <div>
          <label className="relative border-2 border-dashed rounded-lg h-28 flex items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleChange}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Click or drag to add more photos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  JPEG, PNG, or WebP (max 10MB)
                </p>
              </div>
            </div>
          )}
        </label>
        </div>
      )}

      <div className="bg-muted/50 p-3 rounded-lg">
        <p className="text-xs text-muted-foreground">
          💡 <strong>Tip:</strong> Click the X button on any photo to remove it. Maximum 4 photos per project ({media.length}/4).
        </p>
      </div>
    </div>
  );
};
