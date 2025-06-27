import React from "react";
import { Star } from "lucide-react";
import menImg from "../assets/men.jpg";

const TestimonialsSection = () => {
  // Testimonial data
  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, USA",
      image: menImg,
      testimonial:
        "The trip to Bali exceeded all my expectations. The accommodations were luxurious, and the guided tours were informative and fun. I'll definitely book with Luxury Travels again!",
      rating: 5,
    },
    {
      name: "David Chen",
      location: "Toronto, Canada",
      image: menImg,
      testimonial:
        "Our family vacation to Costa Rica was perfectly planned. The kids loved the activities, and we appreciated the attention to detail. Everything was seamless from start to finish.",
      rating: 5,
    },
    {
      name: "Emma Williams",
      location: "London, UK",
      image: menImg,
      testimonial:
        "The Greek Islands tour was magical. The only reason I'm not giving 5 stars is because one of our flights was delayed, but the Luxury Travels team handled it professionally and made alternative arrangements.",
      rating: 4,
    },
    // Add more testimonials as needed
  ];

  return (
    <section className="container py-16 overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-2">
        What Our Travelers Say
      </h2>
      <p className="text-muted-foreground text-center mb-10">
        Hear from our satisfied customers about their experiences
      </p>

      {/* Testimonial Slider */}
      <div className="relative w-full overflow-hidden max-w-screen-2xl mx-auto p-4">
        {/* Slider Track */}
        <div className="flex animate-slide">
          {/* Double the testimonials for seamless looping */}
          {[...testimonials, ...testimonials].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border-1 border-gray-200 p-6 min-w-[400px] mx-2"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  width={100}
                  height={100}
                  className="w-12 h-12 rounded-full"
                />
                <div className="ml-4">
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
              </div>
              <p className="text-gray-700">{testimonial.testimonial}</p>
              <div className="mt-4">
                <span className="text-yellow-500">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 inline-block fill-yellow-500"
                    />
                  ))}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add custom CSS for the animation */}
      <style jsx>{`
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-slide {
          display: flex;
          animation: slide 20s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
