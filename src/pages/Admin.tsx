import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Star, Trash2, Lock } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Simple password - you can change this
  const ADMIN_PASSWORD = "CampJam2025!";

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviews();
    }
  }, [isAuthenticated]);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast({
        title: "Success",
        description: "You are now logged in as admin.",
      });
    } else {
      toast({
        title: "Error",
        description: "Incorrect password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this review? This cannot be undone.")) {
      return;
    }

    setDeletingId(id);
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setReviews(reviews.filter(review => review.id !== id));
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

  if (!isAuthenticated) {
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
              Enter the admin password to manage reviews
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full"
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Login
              </Button>
            </form>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">
                <strong>Default Password:</strong> CampJam2025!
                <br />
                <span className="text-xs">Change this in src/pages/Admin.tsx</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Review Management</h1>
              <p className="text-muted-foreground">Manage customer reviews</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setIsAuthenticated(false);
                setPassword("");
              }}
            >
              Logout
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <Card key={review.id} className="soft-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex gap-1">
                            {renderStars(review.rating)}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(review.created_at)}
                          </span>
                        </div>

                        <p className="text-foreground mb-3 italic">"{review.comment}"</p>

                        <p className="font-semibold text-foreground">— {review.name}</p>
                      </div>

                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleDelete(review.id)}
                        disabled={deletingId === review.id}
                        className="flex-shrink-0"
                      >
                        {deletingId === review.id ? (
                          <span className="animate-spin">⏳</span>
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">No reviews yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
