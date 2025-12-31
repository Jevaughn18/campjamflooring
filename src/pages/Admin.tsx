import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Star, Trash2, Lock, Mail, KeyRound, AlertTriangle, ImageIcon, MessageSquare } from "lucide-react";
import { authAPI, reviewsAPI } from "@/lib/api";
import { GalleryManager } from "@/components/admin/GalleryManager";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface DeleteConfirmation {
  isOpen: boolean;
  reviewId: string | null;
  reviewText: string;
}

const Admin = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<"reviews" | "gallery">("gallery");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmation>({
    isOpen: false,
    reviewId: null,
    reviewText: ""
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    if (user) {
      fetchReviews();
    }
  }, [user]);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authAPI.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const data = await reviewsAPI.getAll();
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userData = await authAPI.login(email, password);
      setUser(userData);

      toast({
        title: "Welcome Back!",
        description: "You've successfully logged in.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Login failed. Please check your credentials.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast({
        title: "Logged Out",
        description: "You've been successfully logged out.",
      });
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
    }
  };

  const openDeleteConfirm = (id: string, comment: string) => {
    setDeleteConfirm({
      isOpen: true,
      reviewId: id,
      reviewText: comment
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      reviewId: null,
      reviewText: ""
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.reviewId) return;

    setDeletingId(deleteConfirm.reviewId);
    closeDeleteConfirm();

    try {
      await reviewsAPI.delete(deleteConfirm.reviewId);

      setReviews(reviews.filter(review => review._id !== deleteConfirm.reviewId));
      toast({
        title: "Review Deleted",
        description: "The review has been permanently deleted.",
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "fill-primary text-primary" : "text-muted-foreground"}
      />
    ));
  };

  // Login Screen
  if (!user) {
    return (
      <div className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
        <Card className="w-full max-w-md soft-shadow">
          <CardContent className="p-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Admin Login</h1>
            <p className="text-muted-foreground text-center mb-6">
              Sign in to manage customer reviews
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isLoading ? "Please wait..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Delete Confirmation Dialog
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
                <h3 className="text-base sm:text-lg font-semibold text-foreground">Delete Review?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground">This action cannot be undone</p>
              </div>
            </div>

            <div className="bg-muted p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
              <p className="text-xs sm:text-sm text-foreground italic break-words">
                "{deleteConfirm.reviewText.substring(0, 150)}{deleteConfirm.reviewText.length > 150 ? '...' : ''}"
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
                Delete Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Admin Dashboard
  return (
    <>
      <DeleteConfirmDialog />

      <div className="min-h-screen bg-secondary/30 py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm sm:text-base text-muted-foreground truncate">Logged in as: {user.email}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full sm:w-auto"
                >
                  Logout
                </Button>
              </div>
            </div>

            <div className="flex gap-2 mb-6 border-b border-border">
              <button
                onClick={() => setActiveTab("gallery")}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === "gallery"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4" />
                  Gallery
                </div>
                {activeTab === "gallery" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("reviews")}
                className={`px-4 py-2 font-medium transition-colors relative ${
                  activeTab === "reviews"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Reviews
                </div>
                {activeTab === "reviews" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            </div>

            {activeTab === "gallery" && <GalleryManager />}

            {activeTab === "reviews" && (
              <>
                <h2 className="text-xl sm:text-2xl font-semibold mb-4">Customer Reviews</h2>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} className="soft-shadow">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between gap-2 sm:gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                            <div className="flex gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs sm:text-sm text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </span>
                          </div>

                          <p className="text-sm sm:text-base text-foreground mb-3 italic break-words">"{review.comment}"</p>

                          <p className="text-sm sm:text-base font-semibold text-foreground truncate">— {review.name}</p>
                        </div>

                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => openDeleteConfirm(review._id, review.comment)}
                          disabled={deletingId === review._id}
                          className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10"
                        >
                          {deletingId === review._id ? (
                            <span className="animate-spin text-sm">⏳</span>
                          ) : (
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg sm:text-xl text-muted-foreground">No reviews yet.</p>
              </div>
            )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Admin;
