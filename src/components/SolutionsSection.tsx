import { Brain, Music, Heart, Shield, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SolutionsSection = () => {
  const solutions = [
    {
      icon: Brain,
      title: "Social Media Algorithm Powered Matching",
      description: "Multi-modal analysis of your music, posts, and preferences creates deeper compatibility scores.",
      features: ["366-dimensional personality vectors", "Music taste analysis", "Emotion-first scoring"]
    },
    {
      icon: Music,
      title: "VibeScroll Feed",
      description: "TikTok meets Pinterest - discover people through their aesthetic and musical vibes.",
      features: ["Visual-first discovery", "Music integration", "Aesthetic affinity sorting"]
    },
    {
      icon: Clock,
      title: "Slow Chat Mode",
      description: "Enforced response buffers reduce anxiety and encourage thoughtful conversations.",
      features: ["15min to 4h response windows", "Anxiety reduction", "Quality over quantity"]
    },
    {
      icon: Heart,
      title: "Vibe Mode",
      description: "Private mood journaling visible only to matches creates authentic emotional connection.",
      features: ["Mood journaling", "Emotional transparency", "Private to matches only"]
    },
    {
      icon: MapPin,
      title: "IRL Connection",
      description: "QR-based meetups at events and Spotify data integration for shared experiences.",
      features: ["Event recommendations", "Time-boxed QR codes", "Location-based matching"]
    },
    {
      icon: Shield,
      title: "Safety First",
      description: "Background checks, toxicity detection, and emotional pacing keep everyone safe.",
      features: ["Criminal background checks", "AI safety monitoring", "Harassment prevention"]
    }
  ];

  return (
    <section className="py-24 px-6 bg-gradient-subtle">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            Our Solution: Authentic Connection
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Kinto revolutionizes how people connect by focusing on what truly matters: 
            shared music taste, emotional compatibility, and genuine human connection.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const Icon = solution.icon;
            return (
              <Card 
                key={index}
                className="shadow-card hover-lift bg-card/80 backdrop-blur-sm border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary-glow" />
                    </div>
                    <CardTitle className="text-lg font-playfair">
                      {solution.title}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {solution.description}
                  </p>
                  <ul className="space-y-2">
                    {solution.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary-glow mr-3" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;