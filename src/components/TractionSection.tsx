import { Users, Heart, TrendingUp, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TractionSection = () => {
  const stats = [
    {
      icon: Users,
      number: "10K+",
      label: "Early Adopters",
      description: "Beta testers across 15 universities"
    },
    {
      icon: Heart,
      number: "89%",
      label: "Match Success Rate",
      description: "Connections lead to meaningful conversations"
    },
    {
      icon: TrendingUp,
      number: "3.2x",
      label: "Engagement Boost",
      description: "Higher than traditional dating apps"
    },
    {
      icon: Award,
      number: "#1",
      label: "Safety Rating",
      description: "Among college dating platforms"
    }
  ];

  const testimonials = [
    {
      quote: "Finally, an app that gets it. Found my best friend through our shared indie playlist!",
      author: "Sarah M.",
      school: "Stanford University"
    },
    {
      quote: "The slow chat feature changed everything. No more pressure to respond instantly.",
      author: "Marcus L.",
      school: "NYU"
    },
    {
      quote: "Kinto helped me connect with people who actually share my music taste and values.",
      author: "Elena R.",
      school: "UC Berkeley"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        {/* Stats Section */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Building Momentum
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Early results show Kinto is changing how young people connect and build relationships.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={index}
                className="shadow-card hover-lift bg-card/50 backdrop-blur-sm border-border/50 text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Icon className="h-8 w-8 text-primary-glow" />
                    </div>
                  </div>
                  <div className="text-3xl font-playfair font-bold text-primary-glow mb-2">
                    {stat.number}
                  </div>
                  <div className="font-semibold mb-2">{stat.label}</div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Testimonials Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h3 className="text-3xl font-playfair font-bold mb-4">
            What Early Users Say
          </h3>
          <p className="text-lg text-muted-foreground">
            Real feedback from our beta community
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="shadow-card hover-lift bg-card/50 backdrop-blur-sm border-border/50 animate-fade-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="text-primary-glow text-4xl font-playfair">"</div>
                </div>
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  {testimonial.quote}
                </p>
                <div className="border-t border-border/50 pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.school}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TractionSection;