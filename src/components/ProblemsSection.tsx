import { AlertTriangle, MessageSquare, Users, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProblemsSection = () => {
  const problems = [
    {
      icon: MessageSquare,
      title: "Shallow Conversations",
      description: "Dating apps focus on looks, not meaningful connections. Small talk gets nowhere."
    },
    {
      icon: Zap,
      title: "Swipe Fatigue",
      description: "Endless swiping with no real matches. It's exhausting and soul-crushing."
    },
    {
      icon: Users,
      title: "Fake Connections",
      description: "People present false personas. You never know who you're really talking to."
    },
    {
      icon: AlertTriangle,
      title: "Social Anxiety",
      description: "Pressure to respond instantly creates stress. Real connections need time to develop."
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mb-6">
            The Problem with Dating Today
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Modern dating apps have lost sight of what matters: genuine human connection. 
            They've become platforms for superficial interactions that leave us feeling more isolated than ever.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <Card 
                key={index} 
                className="shadow-card hover-lift bg-card/50 backdrop-blur-sm border-border/50"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="p-3 rounded-full bg-destructive/10">
                      <Icon className="h-8 w-8 text-destructive" />
                    </div>
                  </div>
                  <h3 className="text-lg font-playfair font-semibold mb-3">
                    {problem.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {problem.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProblemsSection;