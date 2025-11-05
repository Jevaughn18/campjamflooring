import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { Star } from "lucide-react";

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

const Reviews = () => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    comment: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialReviews: Review[] = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Outstanding work! The team transformed my kitchen with beautiful tile work. Professional, clean, and right on schedule.",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Michael Brown",
      rating: 5,
      comment: "Exceptional craftsmanship and attention to detail. My bathroom looks absolutely stunning. Highly recommend CampJam Flooring!",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Jennifer Williams",
      rating: 5,
      comment: "From consultation to completion, the experience was seamless. The flooring in my living room exceeded all expectations.",
      date: "1 month ago"
    },
    {
      id: 4,
      name: "David Thompson",
      rating: 5,
      comment: "Top-notch service and quality. They helped me choose the perfect tiles and the installation was flawless. Worth every penny!",
      date: "2 months ago"
    },
    {
      id: 5,
      name: "Lisa Martinez",
      rating: 5,
      comment: "CampJam Flooring did an amazing job on my entire home. Professional team, fair pricing, and beautiful results. Couldn't be happier!",
      date: "2 months ago"
    },
    {
      id: 6,
      name: "Robert Anderson",
      rating: 5,
      comment: "Excellent work ethic and superior quality. They turned my vision into reality. Definitely the best flooring company in the area.",
      date: "3 months ago"
    }
  ];

  const [reviews, setReviews] = useState<Review[]>(initialReviews);

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
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newReview: Review = {
        id: reviews.length + 1,
        name: formData.name,
        rating: formData.rating,
        comment: formData.comment,
        date: "Just now",
      };

      setReviews([newReview, ...reviews]);
      setFormData({ name: "", rating: 5, comment: "" });
      setShowForm(false);

      toast({
        title: "Review Submitted!",
        description: "Thank you for your feedback. Your review has been posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {reviews.map((review) => (
            <Card key={review.id} className="soft-shadow hover:elegant-shadow transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {renderStars(review.rating)}
                  </div>
                  <span className="text-sm text-muted-foreground">{review.date}</span>
                </div>

                <p className="text-foreground mb-4 italic">"{review.comment}"</p>

                <div className="border-t border-border pt-4">
                  <p className="font-semibold text-foreground">{review.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
