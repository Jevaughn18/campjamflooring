import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Reviews = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load reviews from Supabase on mount
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
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
        description: "Failed to load reviews. Please refresh the page.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.name || !formData.comment) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            name: formData.name,
            rating: formData.rating,
            comment: formData.comment,
          }
        ])
        .select();

      if (error) throw error;

      // Refresh reviews list
      await fetchReviews();

      setFormData({ name: "", rating: 5, comment: "" });
      setShowForm(false);

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review has been posted.",
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} ${diffInWeeks === 1 ? 'week' : 'weeks'} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
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

  const renderInteractiveStars = (currentRating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={24}
        onClick={() => handleRatingClick(index + 1)}
        className={`cursor-pointer transition-colors ${
          index < currentRating ? "fill-primary text-primary" : "text-muted-foreground hover:text-primary"
        }`}
      />
    ));
  };

  return (
    <section id="reviews" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground">
            Customer{" "}
            <span className="relative">
              Reviews
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary transform scale-x-100 origin-left transition-transform duration-500" />
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            See what our satisfied customers have to say about our work
          </p>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 elegant-shadow transition-all duration-300 hover:gold-glow"
          >
            {showForm ? "Cancel" : "Write a Review"}
          </Button>
        </div>

        {/* Review Submission Form */}
        {showForm && (
          <Card className="max-w-2xl mx-auto mb-12 soft-shadow">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6 text-foreground">Share Your Experience</h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full"
                    placeholder="Enter your name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Rating *
                  </label>
                  <div className="flex gap-2">
                    {renderInteractiveStars(formData.rating)}
                  </div>
                </div>

                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-2">
                    Your Review *
                  </label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    className="w-full min-h-[120px]"
                    placeholder="Tell us about your experience with CampJam Flooring..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 elegant-shadow transition-all duration-300 hover:gold-glow"
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Reviews Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {reviews.map((review) => (
              <Card key={review.id} className="soft-shadow hover:elegant-shadow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                    <span className="text-sm text-muted-foreground">{formatDate(review.created_at)}</span>
                  </div>

                  <p className="text-foreground mb-4 italic">"{review.comment}"</p>

                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-foreground">{review.name}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">
              No reviews yet. Be the first to share your experience!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Reviews;
