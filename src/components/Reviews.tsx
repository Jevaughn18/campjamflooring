import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const Reviews = () => {
  const reviews = [
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

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? "fill-primary text-primary" : "text-muted-foreground"}
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
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our satisfied customers have to say about our work
          </p>
        </div>

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
