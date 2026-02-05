import { Button } from "@/components/ui/button";
import { BrainCircuit, BookOpen, Calendar, Swords, Zap, ArrowRight, Trophy, Users, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: BookOpen,
      title: "Normal Quiz",
      description: "Practice with quizzes at your own pace across multiple difficulty levels",
      color: "text-primary",
      bg: "bg-primary/10",
    },
    {
      icon: Calendar,
      title: "Daily Challenge",
      description: "One shot per day to prove your knowledge and compete for daily rewards",
      color: "text-game-daily",
      bg: "bg-game-daily/10",
    },
    {
      icon: Swords,
      title: "Battle Mode",
      description: "Challenge friends or strangers in real-time multiplayer quiz battles",
      color: "text-game-battle",
      bg: "bg-game-battle/10",
    },
    {
      icon: Zap,
      title: "Speed Quiz",
      description: "Race against the clock and answer as many questions as possible",
      color: "text-game-speed",
      bg: "bg-game-speed/10",
    },
  ];

  const stats = [
    { value: "10K+", label: "Active Players" },
    { value: "500+", label: "Quiz Questions" },
    { value: "50K+", label: "Games Played" },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <AnimatedBackground variant="default" />
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuizArena</span>
          </Link>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Log in
            </Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-5xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Trophy className="w-4 h-4" />
              <span>Join 10,000+ students already learning</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight mb-6">
              Test Your Knowledge.
              <br />
              <span className="text-gradient">Challenge Your Friends.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              The ultimate quiz platform for college students. Practice solo, compete in real-time battles, 
              and climb the leaderboard.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="gradient"
                size="xl"
                onClick={() => navigate("/signup")}
              >
                Start Playing Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="xl"
                onClick={() => navigate("/login")}
              >
                I already have an account
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 md:gap-16 mt-16 animate-fade-in" style={{ animationDelay: "200ms" }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Four Ways to Play
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your game mode and start testing your knowledge today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group bg-card/80 backdrop-blur-sm p-6 rounded-2xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 animate-fade-in glow-border"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`w-7 h-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Students Love QuizArena
              </h2>
              <div className="space-y-6">
                {[
                  {
                    icon: Target,
                    title: "Track Your Progress",
                    description: "Monitor your scores, streaks, and improvement over time with detailed analytics",
                  },
                  {
                    icon: Users,
                    title: "Compete with Friends",
                    description: "Challenge classmates to real-time battles and see who knows more",
                  },
                  {
                    icon: Trophy,
                    title: "Earn Achievements",
                    description: "Unlock badges and climb the leaderboard as you master different topics",
                  },
                ].map((item, index) => (
                  <div
                    key={item.title}
                    className="flex gap-4 animate-slide-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex-shrink-0 flex items-center justify-center">
                      <item.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Preview Card */}
            <div className="relative animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div className="bg-card/80 backdrop-blur-sm rounded-2xl border border-border shadow-card-hover p-6 glow-border">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                      <span className="text-sm font-bold text-primary-foreground">AJ</span>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Alex Johnson</p>
                      <p className="text-xs text-muted-foreground">Level 8 • 12,450 pts</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    5 day streak 🔥
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Quizzes", value: "47" },
                    { label: "Win Rate", value: "68%" },
                    { label: "Rank", value: "#5" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center p-3 bg-secondary rounded-xl">
                      <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -z-10 top-8 -right-8 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-8 -left-8 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="gradient-primary rounded-3xl p-8 md:p-12 text-center text-primary-foreground animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Test Your Knowledge?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-xl mx-auto">
              Join thousands of students already competing on QuizArena. 
              Sign up for free and start playing today!
            </p>
            <Button
              size="xl"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => navigate("/signup")}
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
              <BrainCircuit className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">QuizArena</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 QuizArena. Built for college students.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
